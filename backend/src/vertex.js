const { PredictionServiceClient } = require("@google-cloud/aiplatform");
const { PROJECT_ID, REGION, VERTEX_ENDPOINT_ID } = require("./config");


// --- Flood risk prediction ---
function fallbackHeuristic({ weather }) {
  const rainfall = Number(weather?.rainfallMm ?? 0);
  const river = Number(weather?.riverLevelM ?? 0);
  const status = String(weather?.jpsStatus ?? "").toUpperCase();
  const statusOk = status === "ALERT" || status === "WARNING" || status === "DANGER";

  let score = 0.2;
  const reasons = [];

  if (rainfall > 30) { score += 0.25; reasons.push("Rainfall > 30mm"); }
  if (rainfall > 60) { score += 0.25; reasons.push("Rainfall > 60mm"); }

  if (river > 3) { score += 0.15; reasons.push("River level > 3m"); }
  if (river > 5) { score += 0.20; reasons.push("River level > 5m"); }

  // ----- JPS severity ---------
  // Only trust sensor numbers if station status is OK
  if (statusOk) {
    if (rainfall > 30) { score += 0.25; reasons.push("Rainfall > 30mm"); }
    if (rainfall > 60) { score += 0.25; reasons.push("Rainfall > 60mm"); }

    if (river > 3) { score += 0.15; reasons.push("River level > 3m"); }
    if (river > 5) { score += 0.20; reasons.push("River level > 5m"); }
  } else {
    // Still allow a small base score, but don't trust sensor spikes
    if (rainfall || river) reasons.push("Sensor values ignored due to non-OK JPS status");
  }

  score = Math.max(0, Math.min(1, score));
  const riskLevel = score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW";

  return { riskScore: score, riskLevel, hoursAhead: 6, mode: "fallback", reasons };
}

async function predictFloodRisk({ lat, lng, weather }) {
  if (!PROJECT_ID || !VERTEX_ENDPOINT_ID) {
    return fallbackHeuristic({ weather });
  }

  const client = new PredictionServiceClient({
    apiEndpoint: `${REGION}-aiplatform.googleapis.com`,
  });

  const endpoint = `projects/${PROJECT_ID}/locations/${REGION}/endpoints/${VERTEX_ENDPOINT_ID}`;
  const instance = { lat, lng, ...weather };

  const [response] = await client.predict({
    endpoint,
    instances: [instance],
  });

  const pred0 = response.predictions?.[0] || {};
  const riskScore = Number(pred0.riskScore ?? 0.5);
  const riskLevel =
    riskScore >= 0.7 ? "HIGH" :
    riskScore >= 0.4 ? "MEDIUM" :
    "LOW";

  return {
    riskScore,
    riskLevel,
    hoursAhead: 6,
    mode: "vertex",
    reasons: []
  };
}

module.exports = { predictFloodRisk };
