// src/prediction/service.js
const { predictFloodRisk } = require("../vertex");
const { getPrepGuidanceEN, getRoutineChecklistEN  } = require("../gemini");
const { getStationsCached, filterNearbyStations } = require("../gov/jps/services"); 

function buildSummary({ riskLevel, hoursAhead }) {
  if (riskLevel === "HIGH")
    return `⚠️ High flood risk within the next ${hoursAhead} hours. Prepare immediately and consider evacuation.`;
  if (riskLevel === "MEDIUM")
    return `Moderate flood risk within the next ${hoursAhead} hours. Monitor conditions closely and prepare essential items.`;
  return `✅ Low flood risk at the moment. Continue monitoring for updates.`;
}

function tipsFromGuidance(guidanceText) {
  return String(guidanceText || "")
    .split("\n")
    .map((x) => x.replace(/\*\*/g, "").replace(/^[-•\d\)\.\s]+/, "").trim())
    .filter((x) => x.length > 2)
    .slice(0, 8);
}

async function runPrediction({ lat, lng, weather }) {
  // 1) Find nearest JPS station
  let nearest = null;
  try {
    const { stations } = await getStationsCached();
    const nearby = filterNearbyStations({ lat, lng, radiusKm: 30, stations });
    nearest = nearby[0] || null;
  } catch (e) {
    console.warn("JPS fetch failed for AI features:", e.message);
  }

  // 2) Merge JPS into weather
    const isBadStation =
    !nearest ||
    nearest.status === "ERROR" ||
    nearest.status === "UNKNOWN";

  const weatherFromJps = !isBadStation
    ? {
        rainfallMm: nearest.rainfall?.last1hMm ?? nearest.rainfall?.todayMm ?? 0,
        riverLevelM: nearest.waterLevelM ?? 0,
        jpsStatus: nearest.status ?? "UNKNOWN",
      }
    : {
        jpsStatus: nearest?.status ?? "UNKNOWN",
      };
    const mergedWeather = { ...weather, ...weatherFromJps };

  // 3) Predict (heuristic if no Vertex env)
  const pred = await predictFloodRisk({ lat, lng, weather: mergedWeather });

  // 4) Gemini guidance
  const guidanceEN = await getPrepGuidanceEN({
    riskLevel: pred.riskLevel,
    hoursAhead: pred.hoursAhead,
    locationHint: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  });

  //Utk page Preparedness Analysis
  const checklist = await getRoutineChecklistEN({
  riskLevel: pred.riskLevel,
  hoursAhead: pred.hoursAhead,
  locationHint: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
});

  return {
    ok: true,
    riskLevel: pred.riskLevel,
    riskScore: pred.riskScore,
    hoursAhead: pred.hoursAhead,
    summary: buildSummary(pred),
    tipsBM: tipsFromGuidance(guidanceEN),
    checklist, 
    updatedAt: new Date().toISOString(),
    source: (!process.env.PROJECT_ID || !process.env.VERTEX_ENDPOINT_ID) ? "heuristic" : "vertex",

    // 🔎 Debug for demo (super useful for judges)
    aiInputs: {
      lat,
      lng,
      weather: mergedWeather,
      nearestJps: nearest
        ? { id: nearest.id, name: nearest.name, distanceKm: nearest.distanceKm, status: nearest.status }
        : null,
    },
  };
}

module.exports = { runPrediction };