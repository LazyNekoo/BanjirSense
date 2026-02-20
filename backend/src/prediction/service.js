const { predictFloodRisk } = require("../vertex"); // your existing file
const { getPrepGuidanceEN } = require("../gemini"); // your existing file

function buildSummary({ riskLevel, hoursAhead }) {
   if (riskLevel === "HIGH")
    return `⚠️ High flood risk within the next ${hoursAhead} hours. Prepare immediately and consider evacuation.`;
    if (riskLevel === "MEDIUM")
      return `Moderate flood risk within the next ${hoursAhead} hours. Monitor conditions closely and prepare essential items.`;
    return `✅ Low flood risk at the moment. Continue monitoring for updates.`;
  }

function tipsFromGuidance(guidanceText) {
  // convert Gemini output to bullets safely (simple split)
  return guidanceText
    .split("\n")
    .map((x) => x.replace(/^[-•\d\)\.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function runPrediction({ lat, lng, weather }) {
  const pred = await predictFloodRisk({ lat, lng, weather });
  const guidanceBM = await getPrepGuidanceEN({
    riskLevel: pred.riskLevel,
    hoursAhead: pred.hoursAhead,
    locationHint: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  });

  return {
    ok: true,
    riskLevel: pred.riskLevel,
    riskScore: pred.riskScore,
    hoursAhead: pred.hoursAhead,
    summary: buildSummary(pred),
    tipsBM: tipsFromGuidance(guidanceBM),
    updatedAt: new Date().toISOString(),
    source: (!process.env.PROJECT_ID || !process.env.VERTEX_ENDPOINT_ID) ? "heuristic" : "vertex",
  };
}

module.exports = { runPrediction };