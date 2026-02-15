const { PredictionServiceClient } = require("@google-cloud/aiplatform");
const { PROJECT_ID, REGION, VERTEX_ENDPOINT_ID } = require("./config");

// --- Flood risk prediction ---
function fallbackHeuristic({ weather }) {
  const rainfall = Number(weather?.rainfallMm ?? 0);
  const river = Number(weather?.riverLevelM ?? 0);

  // Simple heuristic untuk predict risk banjir
  let score = 0.2;
  if (rainfall > 30) score += 0.3;
  if (rainfall > 60) score += 0.3;
  if (river > 3) score += 0.2;

  score = Math.max(0, Math.min(1, score));
  const riskLevel = score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW";
  return { riskScore: score, riskLevel, hoursAhead: 6 };
}

async function predictFloodRisk({ lat, lng, weather }) {
  // Prelim-safe fallback if no Vertex endpoint yet
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
  const riskLevel = riskScore >= 0.7 ? "HIGH" : riskScore >= 0.4 ? "MEDIUM" : "LOW";
  return { riskScore, riskLevel, hoursAhead: 6 };
}

module.exports = { predictFloodRisk };
