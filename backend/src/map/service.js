// src/map/service.js
const { listStrandedReports } = require("./repo");

function toIsoMaybe(ts) {
  // Firestore Timestamp has toDate()
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

module.exports = { getStrandedMarkers };
