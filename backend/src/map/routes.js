// src/map/routes.js
const express = require("express");
const { getStrandedMarkers } = require("./service");

const router = express.Router();

/**
 * GET /map/markers/stranded?status=ACTIVE
 * Returns map-ready marker data.
 */
router.get("/markers/stranded", async (req, res) => {
  try {
    const status = (req.query.status || "ACTIVE").toString();
    const markers = await getStrandedMarkers({ status, limit: 200 });

    return res.json({
      ok: true,
      status,
      count: markers.length,
      markers,
    });
  } catch (e) {
    console.error("Map markers error:", e);
    return res.status(500).json({ ok: false, error: "map markers failed" });
  }
});

module.exports = router;
