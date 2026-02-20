const express = require("express");
const { runPrediction } = require("./service");

const router = express.Router();

router.post("/predict-flood", async (req, res) => {
  try {
    const { lat, lng, weather = {} } = req.body || {};
    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ ok: false, error: "lat/lng must be numbers" });
    }
    const data = await runPrediction({ lat, lng, weather });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "predict failed" });
  }
});

module.exports = router;