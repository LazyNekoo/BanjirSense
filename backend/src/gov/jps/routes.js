// src/gov/jps/routes.js
const express = require("express");
const { getStationsCached, filterNearbyStations } = require("./services");

const router = express.Router();

/**
 * GET /gov/jps/stations
 * Returns simplified list of stations (cached 10 min).
 */
router.get("/gov/jps/stations", async (req, res) => {
  try {
    const { fromCache, fetchedAt, stations, warning } = await getStationsCached();
    console.log("✅ JPS routes loaded");

    res.json({
      ok: true,
      source: "JPS Public InfoBanjir",
      endpoint: "latestreadingstrendabc.json",
      fromCache,
      fetchedAt: new Date(fetchedAt).toISOString(),
      count: stations.length,
      warning: warning || null,
      stations,
    });
  } catch (e) {
    console.error("JPS stations error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * GET /gov/jps/nearby?lat=..&lng=..&radiusKm=30
 * Returns nearby stations only (map-friendly).
 */
router.get("/gov/jps/nearby", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radiusKm ?? 30);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ ok: false, error: "lat and lng are required numbers" });
    }
    if (!Number.isFinite(radiusKm) || radiusKm <= 0 || radiusKm > 200) {
      return res.status(400).json({ ok: false, error: "radiusKm must be between 1 and 200" });
    }

    const { fromCache, fetchedAt, stations, warning } = await getStationsCached();
    const nearby = filterNearbyStations({ lat, lng, radiusKm, stations });

    res.json({
      ok: true,
      fromCache,
      fetchedAt: new Date(fetchedAt).toISOString(),
      radiusKm,
      count: nearby.length,
      warning: warning || null,
      stations: nearby,
    });
  } catch (e) {
    console.error("JPS nearby error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;