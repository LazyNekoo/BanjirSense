// src/map/service.js
const { listStrandedReports } = require("./repo");

function toIsoMaybe(ts) {
  try {
    if (!ts) return null;
    if (typeof ts.toDate === "function") return ts.toDate().toISOString();
    return null;
  } catch {
    return null;
  }
}

// Return lightweight map markers (frontend-ready)
async function getStrandedMarkers({ status = "ACTIVE", limit = 200 }) {
  const reports = await listStrandedReports({ status, limit });

  return reports.map((r) => ({
    id: r.id,
    type: "STRANDED",
    lat: r.lat,
    lng: r.lng,
    status: r.status || "ACTIVE",
    peopleCount: r.peopleCount ?? 1,
    specialNeeds: Array.isArray(r.specialNeeds) ? r.specialNeeds : [],
    note: r.note || "",
    createdAt: toIsoMaybe(r.createdAt),
  }));
}

// Distance calculation (for nearest safezone)
function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;

  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos(a.lat * Math.PI / 180) *
    Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}

function pickNearest(origin, pois) {
  let best = null;

  for (const p of pois) {
    if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) continue;

    const d = haversineKm(origin, { lat: p.lat, lng: p.lng });
    if (!best || d < best.distanceKm)
      best = { ...p, distanceKm: Number(d.toFixed(2)) };
  }

  return best;
}

module.exports = {
  getStrandedMarkers,
  pickNearest,
};