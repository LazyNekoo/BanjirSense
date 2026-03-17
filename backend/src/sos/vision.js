// src/sos/vision.js
const { VISION_API_KEY } = require("../config");

// node-fetch v3 dynamic import (same style as your gemini)
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function pickTop(arr = [], key = "score", limit = 6) {
  return arr
    .slice()
    .sort((a, b) => (b?.[key] || 0) - (a?.[key] || 0))
    .slice(0, limit);
}

// Simple heuristic (demo-friendly)
function roughDepthEstimateFromKeywords(keywords) {
  // ⚠️ This is not real depth measurement—just for demo cues.
  if (keywords.includes("flood") || keywords.includes("inundation")) return 0.5;
  if (keywords.includes("water")) return 0.3;
  return null;
}

async function analyzeFloodPhoto({ base64 }) {
  if (!VISION_API_KEY) {
    return {
      verified: false,
      summary: "⚠️ VISION_API_KEY not set yet.",
      hazards: [],
      waterDepthEstimateM: null,
      confidence: null,
    };
  }

  if (!base64 || typeof base64 !== "string") {
    return {
      verified: false,
      summary: "Invalid photo format (missing base64).",
      hazards: [],
      waterDepthEstimateM: null,
      confidence: null,
    };
  }

  const url = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

  const body = {
    requests: [
      {
        image: { content: base64 },
        features: [
          { type: "LABEL_DETECTION", maxResults: 20 },
          { type: "OBJECT_LOCALIZATION", maxResults: 20 },
          { type: "TEXT_DETECTION", maxResults: 10 },
        ],
      },
    ],
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Vision error: ${resp.status} ${errText}`);
  }

  const data = await resp.json();
  const r = data?.responses?.[0] || {};

  const labels = pickTop(safeArray(r.labelAnnotations)).map((x) => ({
    name: x.description,
    score: x.score,
  }));

  const objects = pickTop(safeArray(r.localizedObjectAnnotations)).map((x) => ({
    name: x.name,
    score: x.score,
  }));

  const detectedText =
    r.fullTextAnnotation && r.fullTextAnnotation.text
      ? String(r.fullTextAnnotation.text).trim()
      : "";

  const keywords = [...labels.map((l) => l.name), ...objects.map((o) => o.name)]
    .join(" ")
    .toLowerCase();

  const hazards = [];
  if (keywords.includes("flood") || keywords.includes("water")) hazards.push("Rising water detected");
  if (keywords.includes("road") || keywords.includes("street")) hazards.push("Road / access route affected");
  if (keywords.includes("vehicle") || keywords.includes("car")) hazards.push("Vehicles at risk / blocked path");
  if (keywords.includes("mud") || keywords.includes("debris")) hazards.push("Debris / mud hazard");
  if (detectedText.toLowerCase().includes("danger") || detectedText.toLowerCase().includes("bahaya")) {
    hazards.push("Warning signage detected");
  }

  if (
  keywords.includes("flood") ||
  keywords.includes("water") ||
  keywords.includes("inundation") ||
  keywords.includes("standing water") ||
  keywords.includes("overflow") ||
  keywords.includes("wet")
) hazards.push("Rising water detected");

  const waterDepthEstimateM = roughDepthEstimateFromKeywords(keywords);

  const topLabel = labels[0];
  const confidence = topLabel?.score ?? null;

  const summaryParts = [];
  if (topLabel?.name) summaryParts.push(`Top scene: ${topLabel.name}`);
  if (hazards.length) summaryParts.push(`Hazards: ${hazards.join(", ")}`);
  if (typeof waterDepthEstimateM === "number") summaryParts.push(`Estimated depth: ~${waterDepthEstimateM}m`);
  if (detectedText) summaryParts.push(`Text: "${detectedText.slice(0, 80)}"`);

    return {
    verified: true,

    // ✅ frontend-friendly fields
    topLabel: topLabel?.name ?? null,
    labels: labels.map((l) => l.name),
    objects: objects.map((o) => o.name),
    text: detectedText || null, // rename for UI
    confidence,

    // keep your existing fields too
    summary: summaryParts.join(" • ") || "Vision analysis complete.",
    hazards,
    waterDepthEstimateM,

    // optional: keep raw scores for debugging
    labelsWithScore: labels,
    objectsWithScore: objects,
    };
}

module.exports = { analyzeFloodPhoto };