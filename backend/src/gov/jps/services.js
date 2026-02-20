// src/gov/jps/service.js
const JPS_URL =
  "https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/latestreadingstrendabc.json";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cache = {
  fetchedAt: 0,
  data: null,
  error: null,
};

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return null;
}

function toNumberSafe(x) {
  const n = Number(String(x).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function normalizeStatus(raw) {
  const s = String(raw || "").toUpperCase();
  // common statuses observed on JPS: NORMAL / ALERT / WARNING / DANGER
  if (s.includes("DANGER") || s.includes("BAHAYA")) return "DANGER";
  if (s.includes("WARNING") || s.includes("AMARAN")) return "WARNING";
  if (s.includes("ALERT") || s.includes("WASPADA")) return "ALERT";
  if (s.includes("NORMAL")) return "NORMAL";
  return raw ? String(raw) : "UNKNOWN";
}

function normalizeStation(raw) {
  // Try common key variants (JPS sometimes uses different naming)
  const id = pick(raw, ["id", "station_id", "stn_id", "stationid", "no_stesen", "no_stn"]);
  const name = pick(raw, ["name", "station_name", "stn_name", "nama_stesen", "stesen", "station"]);
  const state = pick(raw, ["state", "negeri"]);
  const district = pick(raw, ["district", "daerah"]);

  const lat = toNumberSafe(pick(raw, ["lat", "latitude", "Lat", "Latitude"]));
  const lng = toNumberSafe(pick(raw, ["lng", "lon", "longitude", "Lng", "Long", "Longitude"]));

  // Rainfall variants
  const rainfall1hMm = toNumberSafe(pick(raw, ["rainfall_1h", "rain1h", "rain_1h", "hujan_1j", "hujan1j", "rf_1h"]));
  const rainfall3hMm = toNumberSafe(pick(raw, ["rainfall_3h", "rain3h", "rain_3h", "hujan_3j", "hujan3j", "rf_3h"]));
  const rainfallTodayMm = toNumberSafe(pick(raw, ["rainfall_today", "rain_today", "hujan_hari_ini", "hujan", "rf_today"]));

  // Water level variants
  const waterLevelM = toNumberSafe(pick(raw, ["water_level", "wl", "paras_air", "aras_air", "level", "stage"]));

  // Severity/status variants
  const statusRaw = pick(raw, ["status", "severity", "tahap", "paras_status", "alert_level"]);
  const status = normalizeStatus(statusRaw);

  // Updated time variants
  const updatedAtRaw = pick(raw, [
    "updatedAt",
    "updated_at",
    "last_update",
    "lastUpdated",
    "tarikh_kemaskini",
    "masa_kemaskini",
    "datetime",
    "timestamp",
  ]);

  // Online/offline flags
  const onlineRaw = pick(raw, ["online", "is_online", "status_online", "onoff", "offline"]);
  const isOnline =
    typeof onlineRaw === "boolean"
      ? onlineRaw
      : onlineRaw === null
      ? null
      : String(onlineRaw).toLowerCase().includes("off")
      ? false
      : String(onlineRaw).toLowerCase().includes("on") || String(onlineRaw) === "1"
      ? true
      : null;

  return {
    id: id ? String(id) : null,
    name: name ? String(name) : null,
    state: state ? String(state) : null,
    district: district ? String(district) : null,
    lat,
    lng,
    waterLevelM,
    rainfall: {
      last1hMm: rainfall1hMm,
      last3hMm: rainfall3hMm,
      todayMm: rainfallTodayMm,
    },
    status,
    updatedAt: updatedAtRaw ? String(updatedAtRaw) : null,
    isOnline,
    raw, // keep raw so you can adjust mapping anytime
  };
}

async function fetchJpsRaw() {
  // Node 18+ has global fetch
  const resp = await fetch(JPS_URL, {
    headers: {
      "User-Agent": "BanjirSense/1.0 (hackathon prototype)",
      "Accept": "application/json",
    },
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`JPS fetch failed: ${resp.status} ${t.slice(0, 200)}`);
  }

  const data = await resp.json();
  if (!Array.isArray(data)) throw new Error("JPS response is not an array");
  return data;
}

async function getStationsCached() {
  const now = Date.now();

  if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { fromCache: true, fetchedAt: cache.fetchedAt, stations: cache.data };
  }

  try {
    const raw = await fetchJpsRaw();
    const stations = raw.map(normalizeStation);

    cache = { fetchedAt: now, data: stations, error: null };

    return { fromCache: false, fetchedAt: cache.fetchedAt, stations };
  } catch (e) {
    cache.error = e.message;

    // If fetch fails but we have old data, serve stale (better than breaking demo)
    if (cache.data) {
      return {
        fromCache: true,
        fetchedAt: cache.fetchedAt,
        stations: cache.data,
        warning: `Serving stale cached data due to fetch error: ${e.message}`,
      };
    }

    throw e;
  }
}

// Distance helper (km)
function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}

function filterNearbyStations({ lat, lng, radiusKm, stations }) {
  const origin = { lat, lng };

  return stations
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng))
    .map((s) => {
      const d = haversineKm(origin, { lat: s.lat, lng: s.lng });
      return { ...s, distanceKm: Number(d.toFixed(2)) };
    })
    .filter((s) => s.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

module.exports = {
  getStationsCached,
  filterNearbyStations,
};