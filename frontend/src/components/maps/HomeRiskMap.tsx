//src/compoenents/maps/HomeRiskMap.tsx
import React, { useMemo } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

type LatLng = { lat: number; lng: number };

type Props = {
  userLoc?: LatLng | null;
  zoom?: number;
};

export default function HomeRiskMap({ userLoc, zoom = 14 }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const fallbackCenter = useMemo<LatLng>(() => ({ lat: 3.139, lng: 101.6869 }), []);
  const center = userLoc ?? fallbackCenter;

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: "greedy",
      mapTypeId: "roadmap",
    }),
    []
  );

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-red-600 bg-slate-100">
        Failed to load Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 bg-slate-100">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      key={userLoc ? `${userLoc.lat}-${userLoc.lng}` : "fallback"}
      mapContainerClassName="w-full h-full"
      center={center}
      zoom={zoom}
      options={options}
      onLoad={(m) => {
      if (userLoc) {
        m.panTo(userLoc);
        m.setZoom(zoom);
      }
    }}
    >
      {/* ✅ USER PIN */}
      {userLoc && (
        <MarkerF
          key={`${userLoc.lat},${userLoc.lng}`} 
          position={userLoc}
          title="You are here"
        />
      )}
    </GoogleMap>
  );
}