// src/gov/jkm/services.js
const JKM_URL = "https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const looksLikePct = (kap) => {
  if (kap === null) return false;
  // percentage-like numbers: <= 100 and has decimals OR very small (e.g., 2.6)
  return kap > 0 && kap <= 100 && (!Number.isInteger(kap) || kap < 5);
};

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * "Active" PPS filter:
 * JKM response doesn't clearly give an `active` flag in your sample.
 * So we treat active as:
 * - has valid lat/lng
 * - AND (kapasiti > 0 OR mangsa > 0 OR keluarga > 0)
 */
function isActivePps(p) {
  const lat = toNum(p.latti);
  const lng = toNum(p.longi);
  if (lat === null || lng === null) return false;

  const kapasiti = toNum(p.kapasiti) ?? 0;
  const mangsa = toNum(p.mangsa) ?? 0;
  const keluarga = toNum(p.keluarga) ?? 0;

  return kapasiti > 0 || mangsa > 0 || keluarga > 0;
}

function computeOccupancyPercentage(mangsa, kapasitiRaw) {
  const kap = toNum(kapasitiRaw);
  const m = toNum(mangsa) ?? 0;

  if (kap === null || kap <= 0) return null;

  // ✅ If JKM "kapasiti" already looks like a percentage, use it directly
  if (looksLikePct(kap)) {
    return Math.max(0, Math.min(100, Math.round(kap)));
  }

  // ✅ Otherwise treat it as a real capacity number (people)
  const pct = (m / kap) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function computeStatus(occupancyPercentage) {
  if (occupancyPercentage === null) return "unknown";
  if (occupancyPercentage >= 90) return "at-capacity";
  return "operational";
}

async function fetchJkmPps() {
  const res = await fetch(JKM_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`JKM fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Your sample format: { points: [...] }
  const points = Array.isArray(data?.points) ? data.points : Array.isArray(data) ? data : [];
  return points;
}

async function listNearbyPps({ lat, lng, radiusKm = 30, limit = 8 }) {
  const raw = await fetchJkmPps();

  const active = raw.filter(isActivePps);

  const mapped = active
    .map((p) => {
      const pLat = toNum(p.latti);
      const pLng = toNum(p.longi);
      const mangsa = toNum(p.mangsa) ?? 0;
      const kapasiti = toNum(p.kapasiti) ?? 0;

      const distanceKm =
        pLat !== null && pLng !== null ? haversineKm(lat, lng, pLat, pLng) : null;

      const occupancyPercentage = computeOccupancyPercentage(mangsa, kapasiti);
      const status = computeStatus(occupancyPercentage);

      return {
        id: String(p.id),
        name: p.name,
        latitude: pLat,
        longitude: pLng,
        negeri: p.negeri || null,
        daerah: p.daerah || null,
        bencana: p.bencana || null,
        mangsa,
        keluarga: toNum(p.keluarga) ?? 0,
        kapasiti,
        occupancyPercentage,
        status,
        distanceKm,
        // JKM API doesn't provide "verified time" in your sample → we put backend fetch time
        lastVerified: new Date().toISOString(),
      };
    })
    .filter((x) => x.distanceKm !== null && x.distanceKm <= radiusKm)
    .sort((a, b) => (a.distanceKm ?? 999999) - (b.distanceKm ?? 999999))
    .slice(0, limit);

  return mapped;
}

module.exports = {
  fetchJkmPps,
  listNearbyPps,
};