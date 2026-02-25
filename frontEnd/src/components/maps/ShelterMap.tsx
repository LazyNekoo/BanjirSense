// src/components/maps/ShelterMap.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  Map as MapIcon,
  Megaphone,
  Navigation,
  Search,
  Shield,
  User,
} from "lucide-react";
import {
  GoogleMap,
  MarkerF,
  MarkerClustererF,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useNavigation } from "../../lib/navigation";
import ShelterSelectionSheet, { ShelterInfo } from "./ShelterSelectionSheet";
import { apiFetch } from "../../lib/api";

interface ShelterMapProps {
  userLoc?: { lat: number; lng: number };
  safeZoneStatus?: { area: string; riskLevel: "low" | "medium" | "high" };
  onNavigate?: (screen: string) => void;
  onOpenSOS?: () => void;
}

// backend might return: { ok, shelters: [...] } OR plain array
type JkmPpsResp = { ok?: boolean; shelters?: any[] } | any[];

const containerStyle: React.CSSProperties = { width: "100%", height: "100%" };
const FALLBACK_CENTER = { lat: 3.0738, lng: 101.5183 }; // Shah Alam fallback

// --- occupancy helpers (JKM style) ---
const getOccColor = (pct: number) => {
  if (pct >= 80) return "#B71C1C"; // 🔴
  if (pct >= 40) return "#FFD600"; // 🟡
  return "#1B5E20"; // 🟢
};

const getOccLabel = (pct: number) => {
  if (pct >= 80) return "FULL";
  if (pct >= 40) return "ALMOST FULL";
  return "AVAILABLE";
};

// haversine distance in KM
const haversineKm = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
};

const toNum = (v: any) => {
  if (v === undefined || v === null || v === "") return null;

  const str = String(v).trim();

  // "95,333" -> "95.333"
  // "1,234.56" -> "1234.56"
  const normalized =
    str.includes(",") && !str.includes(".")
      ? str.replace(",", ".")
      : str.replace(/,/g, "");

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};

/// Normalize API payload -> ShelterInfo
const normalizeJKM = (rawList: any[]): ShelterInfo[] => {
  const normalized: ShelterInfo[] = (rawList || []).map((s: any) => {
    const latitude = toNum(s.latitude ?? s.lat ?? s.latti);
    const longitude = toNum(s.longitude ?? s.lng ?? s.longi);

    const mangsa = toNum(s.mangsa ?? s.victims) ?? 0;
    const kapasiti = toNum(s.kapasiti ?? s.capacity);

    // Trust backend occupancyPercentage only if valid
    const apiOcc = toNum(s.occupancyPercentage);

    // Otherwise compute
    const computedOcc =
      kapasiti && kapasiti > 0 ? (mangsa / kapasiti) * 100 : null;

    // Final always number 0..100
    const occupancyPercentage = Math.max(
      0,
      Math.min(100, apiOcc ?? (computedOcc ?? 0))
    );

    const status: ShelterInfo["status"] =
      occupancyPercentage >= 80 ? "at-capacity" : "operational";

    return {
      id: String(s.id ?? `${s.name ?? "pps"}-${latitude}-${longitude}`),
      name: String(s.nama_pps ?? s.name ?? "PPS"),
      location: String(
        [s.daerah, s.negeri].filter(Boolean).join(", ") ||
          s.daerah ||
          s.negeri ||
          "Malaysia"
      ),
      distance: String(s.distance ?? s.distanceKm ?? "-"),
      occupancyPercentage,
      status,
      lastVerified: String(s.lastVerified ?? "Just now"),
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      amenities: { medical: true, food: true, petFriendly: false, power: true },
      photo: s.photo,
      victims: mangsa,
      capacity: kapasiti ?? undefined,
    };
  });

  return normalized.filter(
    (x) =>
      Number.isFinite(x.latitude) &&
      Number.isFinite(x.longitude) &&
      !(x.latitude === 0 && x.longitude === 0)
  );
};

const ShelterMap: React.FC<ShelterMapProps> = ({
  userLoc,
  safeZoneStatus = { area: "Shah Alam", riskLevel: "low" },
  onNavigate,
  onOpenSOS,
}) => {
  const navigation = useNavigation();

  // Bottom sheet
  const minSheet = 0.14;
  const [sheetHeight, setSheetHeight] = useState(0.4);
  const [selectedChip, setSelectedChip] = useState<"shelter" | null>(null);

  const activePanel: "environment" | "shelter" =
    selectedChip === "shelter" ? "shelter" : "environment";

  const maxSheet = activePanel === "shelter" ? 0.68 : 0.48;
  const isSheetOpen = sheetHeight > minSheet + 0.02;

  // ✅ drag ref (adds moved flag so clicks aren't killed)
  const dragStateRef = useRef({
    isDragging: false,
    startY: 0,
    startHeight: 0,
    moved: false,
  });

  // Google map refs
  const mapRef = useRef<google.maps.Map | null>(null);

  // PPS state
  const [allShelters, setAllShelters] = useState<ShelterInfo[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<ShelterInfo | null>(
    null
  );
  const [loadingShelters, setLoadingShelters] = useState(false);

  // ✅ Directions to nearest shelter
  const [directions, setDirections] =useState<google.maps.DirectionsResult | null>(null);
  const [routeTarget, setRouteTarget] = useState<ShelterInfo | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const clearRoute = () => {
    setDirections(null);
    setRouteTarget(null);
    setLoadingRoute(false);
  };

  const EPS = 0.01;
  const isAtMax = sheetHeight >= maxSheet - EPS; // kept for your logic (even if unused)

  // ✅ center uses userLoc
  const center = useMemo(() => userLoc ?? FALLBACK_CENTER, [userLoc]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (!userLoc) return;
    if (!mapRef.current) return;

    mapRef.current.panTo(userLoc);
    mapRef.current.setZoom(14);
  }, [isLoaded, userLoc]);

  useEffect(() => {
    if (activePanel === "shelter" && sheetHeight < 0.58) setSheetHeight(0.58);
  }, [activePanel, sheetHeight]);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  const handleSheetToggle = () => {
    setSheetHeight((current) =>
      current > (minSheet + maxSheet) / 2 ? minSheet : maxSheet
    );
  };

  // ✅ pointer drag that doesn't break click
  const handleSheetPointerDown: React.PointerEventHandler<HTMLElement> = (
    event
  ) => {
    dragStateRef.current = {
      isDragging: true,
      startY: event.clientY,
      startHeight: sheetHeight,
      moved: false,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragStateRef.current.isDragging) return;

      const delta = moveEvent.clientY - dragStateRef.current.startY;

      // if user moved enough => mark moved (so click won't toggle)
      if (Math.abs(delta) > 5) dragStateRef.current.moved = true;

      const next = dragStateRef.current.startHeight - delta / window.innerHeight;
      setSheetHeight(clamp(next, minSheet, maxSheet));
    };

    const handlePointerUp = () => {
      dragStateRef.current.isDragging = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // ✅ safe click toggle (ignore if it was a drag)
  const handleHeaderClick = () => {
    if (dragStateRef.current.moved) return;
    handleSheetToggle();
  };

  const handleNavigate = (screen: string) => {
    if (onNavigate) return onNavigate(screen);
    navigation?.navigate(screen);
  };

  const getStatusLabel = (level: string) => {
    switch (level) {
      case "high":
        return "Critical Conditions";
      case "medium":
        return "Conditions Watch";
      default:
        return "Environment Stable";
    }
  };

  // ✅ Map options
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: true,
      gestureHandling: "greedy",
    }),
    []
  );

  // ✅ red pin (user) — kept (optional to use)
  const userRedPinIcon = useMemo(() => {
    if (!isLoaded) return undefined;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 7,
      fillColor: "#DC2626",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 3,
    } as google.maps.Symbol;
  }, [isLoaded]);

  // ✅ PPS dot icon builder (needs google maps loaded)
  const buildPpsDotIcon = (pct: number): google.maps.Icon | undefined => {
    if (!isLoaded) return undefined;
    const fill = getOccColor(pct);
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <circle cx="14" cy="14" r="10" fill="${fill}" stroke="white" stroke-width="4" />
      </svg>
    `);

    return {
      url: `data:image/svg+xml;charset=UTF-8,${svg}`,
      scaledSize: new google.maps.Size(22, 22),
      anchor: new google.maps.Point(11, 11),
    };
  };

  //When user click 'Center' button
  const flyToUser = () => {
    const m = mapRef.current;
    if (!m || !userLoc) return;
    m.setZoom(18);
    m.setCenter(userLoc);
    m.panTo(userLoc);
  };

  // ✅ Get directions to nearest PPS
    const getDirectionsToNearestPps = async () => {
    if (!isLoaded) return;
    if (!userLoc) return;
    if (!nearestShelter?.shelter) return;

    const target = nearestShelter.shelter;
    setRouteTarget(target);
    setLoadingRoute(true);

    try {
      const service = new google.maps.DirectionsService();

      const result = await service.route({
        origin: userLoc,
        destination: { lat: target.latitude, lng: target.longitude },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      });

      setDirections(result);

      // ✅ Fit route on screen
      const bounds = new google.maps.LatLngBounds();
      result.routes[0]?.overview_path?.forEach((p) => bounds.extend(p));
      mapRef.current?.fitBounds(bounds);
    } catch (e) {
      console.warn("Directions failed:", e);
      clearRoute();
    } finally {
      setLoadingRoute(false);
    }
  };

  // Load PPS (live refresh)
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const loadAllPps = async () => {
      setLoadingShelters(true);
      try {
        const data = await apiFetch<any>("/gov/jkm/pps");

        // /gov/jkm/pps returns { ok, shelters: [...] }
        // raw JKM returns { points: [...] }
        // accept everything:
        const rawList = Array.isArray(data)
          ? data
          : (data.shelters ?? data.points ?? []);

        const cleaned = normalizeJKM(rawList);
        setAllShelters(cleaned);

        // keep selected shelter updated (if still exists)
        setSelectedShelter((prev) => {
          if (!prev) return prev;
          const updated = cleaned.find((x) => x.id === prev.id);
          return updated ?? prev;
        });
      } catch (e) {
        console.warn("JKM PPS fetch failed:", e);
        if (!cancelled) setAllShelters([]);
      } finally {
        if (!cancelled) setLoadingShelters(false);
      }
    };

    loadAllPps();
    timer = window.setInterval(loadAllPps, 90_000);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  // ✅ Container A: nearest PPS
  const nearestShelter = useMemo(() => {
    if (!userLoc) return null;
    if (!allShelters.length) return null;

    let best: ShelterInfo | null = null;
    let bestD = Infinity;

    for (const s of allShelters) {
      const d = haversineKm(userLoc, { lat: s.latitude, lng: s.longitude });
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }

    if (!best) return null;
    return { shelter: best, distanceKm: bestD };
  }, [userLoc, allShelters]);

  const focusShelter = (s: ShelterInfo, zoom = 14) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: s.latitude, lng: s.longitude });
      mapRef.current.setZoom(zoom);
    }
    setSelectedShelter(s);
  };

  const listShelters = useMemo(() => {
    if (!userLoc)
      return [...allShelters].sort((a, b) => a.name.localeCompare(b.name));

    return [...allShelters].sort((a, b) => {
      const da = haversineKm(userLoc, { lat: a.latitude, lng: a.longitude });
      const db = haversineKm(userLoc, { lat: b.latitude, lng: b.longitude });
      return da - db;
    });
  }, [allShelters, userLoc]);

  return (
    <div className="w-full h-full bg-slate-100 font-display text-dark-text relative overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        {!isLoaded && !loadError && (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            Loading map…
          </div>
        )}
        {loadError && (
          <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">
            Google Maps failed to load (check API key).
          </div>
        )}

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={userLoc ? 14 : 12}
            options={mapOptions}
            onLoad={(m) => {
              mapRef.current = m;

              // ✅ if userLoc exists at load time, pan immediately
              if (userLoc) {
                m.panTo(userLoc);
                m.setZoom(14);
              }
            }}
          >
            {/* ✅ USER PIN */}
            {userLoc && (
              <MarkerF
                key={`${userLoc.lat},${userLoc.lng}`}
                position={userLoc}
                title="You are here"
                // icon={userRedPinIcon} // optional if you want the red dot
              />
            )}

            {/* ✅ ROUTE */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: false, // keep default A/B markers
                  preserveViewport: true,
                }}
              />
            )}

            {/* ✅ ALL PPS markers (clustered) */}
            <MarkerClustererF>
              {(clusterer) => (
                <>
                  {allShelters.map((s) => (
                    <MarkerF
                      key={s.id}
                      clusterer={clusterer}
                      position={{ lat: s.latitude, lng: s.longitude }}
                      icon={buildPpsDotIcon(s.occupancyPercentage)}
                      title={`${s.name} • ${Math.round(
                        s.occupancyPercentage
                      )}% • ${getOccLabel(s.occupancyPercentage)}`}
                      onClick={() => setSelectedShelter(s)}
                    />
                  ))}
                </>
              )}
            </MarkerClustererF>
          </GoogleMap>
        )}
      </div>

      {/* Top search + chips */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 flex items-center px-4 py-3 gap-3">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search for shelters or safe routes"
              className="bg-transparent border-none text-sm placeholder:text-slate-400 focus:ring-0 w-full p-0"
            />
          </div>

          <button
            onClick={flyToUser}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 px-4 py-3 text-xs font-bold text-slate-700"
          >
            Center
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          <button
            onClick={() =>
              setSelectedChip((cur) => (cur === "shelter" ? null : "shelter"))
            }
            className={`px-8 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-200 transform ${
              selectedChip === "shelter"
                ? "bg-primary text-white shadow-lg shadow-blue-900/30 scale-105"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:scale-105"
            }`}
          >
            Shelters
          </button>

          {loadingShelters && selectedChip === "shelter" && (
            <span className="text-xs text-white bg-slate-900/60 px-3 py-1.5 rounded-full">
              Loading PPS…
            </span>
          )}

          {selectedChip === "shelter" && !loadingShelters && (
            <span className="text-xs text-white bg-slate-900/60 px-3 py-1.5 rounded-full">
              PPS: {allShelters.length}
            </span>
          )}
        </div>

        {/* ✅ Container A: Nearest Shelter */}
        {selectedChip === "shelter" && nearestShelter && (
          <button
            onClick={() => focusShelter(nearestShelter.shelter, 15)}
            className="w-full text-left bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Nearest PPS
                </div>
                <div className="text-sm font-extrabold text-slate-900 leading-tight">
                  {nearestShelter.shelter.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {nearestShelter.shelter.location} •{" "}
                  {nearestShelter.distanceKm.toFixed(1)} km
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: getOccColor(
                      nearestShelter.shelter.occupancyPercentage
                    ),
                  }}
                />
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">
                    {Math.round(nearestShelter.shelter.occupancyPercentage)}%
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">
                    {getOccLabel(nearestShelter.shelter.occupancyPercentage)}
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Bottom panel */}
      <div className="mt-auto relative z-30">
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-slate-100">
          <button
            onClick={handleSheetToggle}
            onPointerDown={handleSheetPointerDown}
            className="w-full flex items-center justify-center py-3 touch-none"
            aria-expanded={isSheetOpen}
          >
            <span className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </button>

          <div
            className={`px-6 overflow-hidden flex flex-col transition-all duration-200 ${
              isSheetOpen ? "overflow-y-auto pb-4" : "pb-0"
            }`}
            style={{
              maxHeight: isSheetOpen
                ? activePanel === "shelter"
                  ? "340px"
                  : "280px"
                : "0px",
            }}
          >
            {activePanel !== "shelter" ? (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                    <Shield size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900 leading-tight">
                        {getStatusLabel(safeZoneStatus.riskLevel)}
                      </h2>
                      
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tactical View • Verified by{" "}
                      <span className="font-bold text-primary">Gemini AI</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                <button
                  onClick={getDirectionsToNearestPps}
                  disabled={!userLoc || !nearestShelter || loadingRoute}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/10 transition-colors ${
                    !userLoc || !nearestShelter || loadingRoute
                      ? "bg-slate-300 text-white cursor-not-allowed"
                      : "bg-primary text-white hover:bg-blue-900"
                  }`}
                >
                  <Navigation size={18} />
                  {loadingRoute ? "Routing..." : "Get Directions to Nearest PPS"}
                </button>

                {/* ✅ Container: Route Target (same design as listing) */}
                {routeTarget && (
                  <button
                    onClick={() => focusShelter(routeTarget, 15)}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl px-4 py-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-slate-900 truncate">
                          {routeTarget.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {routeTarget.location}
                          {userLoc
                            ? ` • ${haversineKm(userLoc, {
                                lat: routeTarget.latitude,
                                lng: routeTarget.longitude,
                              }).toFixed(1)} km`
                            : ""}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-1">
                          Capacity:{" "}
                          <span className="font-bold text-slate-900">
                            {routeTarget.victims ?? 0}
                          </span>
                          {typeof routeTarget.capacity === "number" ? (
                            <>
                              {" "}
                              /{" "}
                              <span className="font-bold text-slate-900">
                                {routeTarget.capacity}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            background: getOccColor(Math.round(routeTarget.occupancyPercentage)),
                          }}
                        />
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900">
                            {Math.round(routeTarget.occupancyPercentage)}%
                          </div>
                          <div className="text-[10px] font-bold text-slate-500">
                            {getOccLabel(Math.round(routeTarget.occupancyPercentage))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearRoute();
                        }}
                        className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        Clear Route
                      </button>
                    </div>
                  </button>
                )}
                </div>
              </>
            ) : (
              <>
                {/* ✅ header: click toggles, drag still works */}
                <div
                  className="pt-2 pb-4 touch-none"
                  onPointerDown={handleSheetPointerDown}
                  onClick={handleHeaderClick}
                >
                  <h2 className="text-2xl font-black text-slate-900 leading-tight text-center">
                    PPS Shelters
                  </h2>
                  <p className="text-slate-500 text-[13px] font-medium mt-1 text-center">
                    Tap a row to focus the marker.
                  </p>

                  <div className="mt-3 flex justify-center gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#1B5E20" }}
                      />
                      &lt; 40%
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#FFD600" }}
                      />
                      40–79%
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#B71C1C" }}
                      />
                      ≥ 80%
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
                  {listShelters.map((s) => {
                    const pct = Number.isFinite(s.occupancyPercentage)
                      ? Math.round(s.occupancyPercentage)
                      : 0;
                    const dist = userLoc
                      ? haversineKm(userLoc, {
                          lat: s.latitude,
                          lng: s.longitude,
                        })
                      : null;

                    return (
                      <button
                        key={s.id}
                        onClick={() => focusShelter(s, 15)}
                        className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl px-4 py-3 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold text-slate-900 truncate">
                              {s.name}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {s.location}
                              {dist !== null ? ` • ${dist.toFixed(1)} km` : ""}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ background: getOccColor(pct) }}
                            />
                            <div className="text-right">
                              <div className="text-xs font-black text-slate-900">
                                {pct}%
                              </div>
                              <div className="text-[10px] font-bold text-slate-500">
                                {getOccLabel(pct)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {!loadingShelters &&
                    selectedChip === "shelter" &&
                    listShelters.length === 0 && (
                      <div className="text-center text-sm text-slate-500 py-10">
                        No PPS available from API (or coordinates missing).
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ your details sheet (make sure its container is absolute in the sheet file) */}
      <ShelterSelectionSheet
        shelter={selectedShelter}
        isOpen={!!selectedShelter}
        onClose={() => setSelectedShelter(null)}
      />

      <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-40">
        <button
          onClick={() => handleNavigate("home")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={() => handleNavigate("map")}
          className="flex flex-col items-center gap-1 text-primary"
        >
          <MapIcon size={20} />
          <span className="text-[10px] font-bold">Map</span>
        </button>

        <div className="flex flex-col items-center gap-1 -mt-10">
          <button
            onClick={() => onOpenSOS?.()}
            className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform font-black text-2xl tracking-tighter hover:bg-blue-900"
          >
            SOS
          </button>
        </div>

        <button
          onClick={() => handleNavigate("updates")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <Megaphone size={20} />
          <span className="text-[10px] font-medium">Updates</span>
        </button>

        <button
          onClick={() => handleNavigate("profile")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default ShelterMap;