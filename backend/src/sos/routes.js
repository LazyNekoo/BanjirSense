const express = require("express");
const { requireAuth } = require("../auth/middleware");
const { addStrandedReport } = require("../firestore"); // your existing function
const { getStrandedGuidanceBM } = require("../gemini"); // your existing

const router = express.Router();

router.post("/sos/activate", requireAuth, async (req, res) => {
  try {
    const { lat, lng, peopleCount = 1, specialNeeds = [], note = "" } = req.body || {};
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ ok: false, error: "lat/lng required" });
    }

    const reportId = await addStrandedReport({ lat, lng, peopleCount, specialNeeds, note });

    const guidanceBM = await getStrandedGuidanceBM({
      peopleCount,
      specialNeeds,
      locationHint: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });

    res.json({ ok: true, reportId, status: "ACTIVE", guidanceBM });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "sos activate failed" });
  }
});

module.exports = router;