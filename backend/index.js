const express = require("express");
const cors = require("cors");

const { getPrepGuidanceBM, getStrandedGuidanceBM } = require("./src/gemini");
const { predictFloodRisk } = require("./src/vertex");
const { addStrandedReport, listStrandedReports } = require("./src/firestore");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => res.json({ ok: true, service: "BanjirSense+ Backend" }));

// POST /predict-flood
app.post("/predict-flood", async (req, res) => {
  try {
    const { lat, lng, weather = {} } = req.body || {};
    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ error: "lat and lng must be numbers" });
    }

    const pred = await predictFloodRisk({ lat, lng, weather });

    const guidanceBM = await getPrepGuidanceBM({
      riskLevel: pred.riskLevel,
      hoursAhead: pred.hoursAhead,
      locationHint: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });

    return res.json({
      riskLevel: pred.riskLevel,
      riskScore: pred.riskScore,
      hoursAhead: pred.hoursAhead,
      guidanceBM,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "predict-flood failed" });
  }
});

// POST /report-stranded
app.post("/report-stranded", async (req, res) => {
  try {
    const { lat, lng, peopleCount = 1, specialNeeds = [], note = "" } = req.body || {};
    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ error: "lat and lng must be numbers" });
    }

    const reportId = await addStrandedReport({
      lat,
      lng,
      peopleCount,
      specialNeeds,
      note,
    });

    const guidanceBM = await getStrandedGuidanceBM({
      peopleCount,
      specialNeeds,
      locationHint: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });

    return res.json({ reportId, status: "RECEIVED", guidanceBM });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "report-stranded failed" });
  }
});

// GET /stranded
app.get("/stranded", async (req, res) => {
  try {
    const status = (req.query.status || "ACTIVE").toString();
    const data = await listStrandedReports({ status, limit: 200 });
    return res.json({ status, reports: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "stranded list failed" });
  }
});

// ✅ Local runs use module.exports
module.exports = app;

// ✅ Cloud Functions Gen2 uses named export
exports.banjirsenseApi = app;
