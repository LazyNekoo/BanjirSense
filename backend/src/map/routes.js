// src/map/routes.js
const express = require("express");
const { getStrandedMarkers } = require("./service");
const { db } = require("../firebaseAdmin");
const { pickNearest } = require("./service");

const router = express.Router();

/**
 * GET /map/markers/stranded?status=ACTIVE
 * Returns map-ready marker data from stranded_reports
 */
router.get("/map/markers/stranded", async (req, res) => {
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

/**
 * GET /map/pois?type=SHELTER
 * Return POIs like shelters, medical centers, high ground (dummy now, real later)
 */
router.get("/map/pois", async (req, res) => {
  try {
    const type = req.query.type ? String(req.query.type) : null;

    let q = db.collection("pois");
    if (type) q = q.where("type", "==", type);

    const snap = await q.limit(200).get();
    const pois = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return res.json({ ok: true, count: pois.length, pois });
  } catch (e) {
    console.error("Map pois error:", e);
    return res.status(500).json({ ok: false, error: "map pois failed" });
  }
});

/**
 * GET /map/nearest-safezone?lat=..&lng=..
 * Returns nearest shelter/high-ground (Phase 1 simple)
 */
router.get("/map/nearest-safezone", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ ok: false, error: "lat/lng required" });
    }

    const snap = await db
      .collection("pois")
      .where("type", "in", ["SHELTER", "HIGH_GROUND"])
      .limit(500)
      .get();

    const pois = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const nearest = pickNearest({ lat, lng }, pois);

    return res.json({ ok: true, nearest: nearest || null });
  } catch (e) {
    console.error("Nearest safezone error:", e);
    return res.status(500).json({ ok: false, error: "nearest safezone failed" });
  }
});

module.exports = router;