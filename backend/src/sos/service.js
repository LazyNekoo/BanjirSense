// src/sos/service.js
const { addStrandedReport } = require("../firestore");
const { getStrandedGuidanceEN } = require("../gemini");
const { analyzeFloodPhoto } = require("./vision");

function extractBase64(dataUrl) {
  if (!dataUrl) return null;
  const match = String(dataUrl).match(/^data:image\/\w+;base64,(.+)$/);
  return match ? match[1] : null;
}

function isFiniteNumber(x) {
  return Number.isFinite(x) && typeof x === "number";
}

function makeHttpError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

async function activateSOS(payload) {
  const {
    lat,
    lng,
    peopleCount = 1,
    specialNeeds = [],
    note = "",
    photoDataUrl = null,
  } = payload || {};

  if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) {
    throw makeHttpError("lat/lng required", 400);
  }

  // ✅ Photo optional (SOS continues even if Vision fails)
  let vision = null;

  const base64 = extractBase64(photoDataUrl);
  if (base64) {
    // Size guard (keep your backend safe)
    const approxBytes = Math.floor((base64.length * 3) / 4);
    if (approxBytes > 1_000_000) {
      throw makeHttpError("photo too large", 413);
    }

    try {
      // Vision REST API (API key)
      vision = await analyzeFloodPhoto({ base64 });
    } catch (err) {
      console.warn("Vision failed, continuing SOS:", err?.message || err);
      vision = null;
    }
  }

  // ✅ Save report to Firestore
  const reportId = await addStrandedReport({
    lat,
    lng,
    peopleCount,
    specialNeeds,
    note,
    photoProvided: Boolean(base64),

    // store vision object for UI + audit
    vision: vision || null,

    // convenience fields for query/filter
    hazards: vision?.hazards || [],
    waterDepthEstimateM: vision?.waterDepthEstimateM ?? null,
    verified: vision?.verified ?? false,
    confidence: vision?.confidence ?? null,
  });

  // ✅ Gemini guidance enriched by Vision
  const guidanceEN = await getStrandedGuidanceEN({
    peopleCount,
    specialNeeds,
    locationHint: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    visionSummary: vision?.summary ?? null,
    hazards: vision?.hazards ?? [],
    waterDepthEstimateM: vision?.waterDepthEstimateM ?? null,
  });

  return {
    reportId,
    status: "ACTIVE",
    guidanceEN,
    vision,
  };
}

module.exports = { activateSOS };