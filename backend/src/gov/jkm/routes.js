// src/gov/jkm/routes.js
const express = require("express");
const { listNearbyPps } = require("./services");

const router = express.Router();

const JKM_URL = "https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php";
const CACHE_TTL_MS = 5 * 60 * 1000;
//const CACHE_TTL_MS = 0;

let cache = {
  ts: 0,
  data: null,
  key: "",
};

// --- helpers ---
function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Heuristic: JKM "kapasiti" sometimes is actually occupancy %
// Examples: 2.6, 95.3333, 65.375 (<= 100 and often decimals)
// We treat these as percentage values directly.
function looksLikePct(kap) {
  if (kap === null) return false;
  return kap > 0 && kap <= 100 && (!Number.isInteger(kap) || kap < 5);
}

function computeOcc(mangsaRaw, kapasitiRaw) {
  const mangsa = toNum(mangsaRaw) ?? 0;
  const kap = toNum(kapasitiRaw);

  if (kap === null || kap <= 0) return null;

  // ✅ kapasiti already percentage
  if (looksLikePct(kap)) {
    return Math.max(0, Math.min(100, Math.round(kap)));
  }

  // ✅ kapasiti is real capacity (people)
  const pct = (mangsa / kap) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

router.get("/gov/jkm/pps", async (req, res) => {
  try {
    const a = req.query.a ?? "0";
    const b = req.query.b ?? "0";

    const cacheKey = `${a}:${b}`;
    const now = Date.now();

    if (cache.data && cache.key === cacheKey && now - cache.ts < CACHE_TTL_MS) {
      return res.json({
        ok: true,
        fromCache: true,
        fetchedAt: new Date(cache.ts).toISOString(),
        ...cache.data,
      });
    }

    const response = await fetch(`${JKM_URL}?a=${a}&b=${b}`, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Referer: "https://infobencanajkmv2.jkm.gov.my/",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: "JKM fetch failed" });
    }

    const raw = await response.json();
    const points = Array.isArray(raw.points) ? raw.points : [];

    const normalized = points.map((p) => {
      const latitude = toNum(p.latti);
      const longitude = toNum(p.longi);

      const mangsa = toNum(p.mangsa) ?? 0;
      const kapasiti = toNum(p.kapasiti) ?? 0;

      // ✅ FIXED: correct occupancy logic
      const occupancyPercentage = computeOcc(mangsa, kapasiti);

      return {
        id: String(p.id),
        name: p.name,
        latitude,
        longitude,
        negeri: p.negeri,
        daerah: p.daerah,
        mukim: p.mukim,
        bencana: p.bencana,
        mangsa,
        keluarga: toNum(p.keluarga) ?? 0,
        kapasiti, // keep raw-ish value for debugging
        occupancyPercentage,
        status:
          occupancyPercentage !== null && occupancyPercentage >= 80
            ? "at-capacity"
            : "operational",
        lastVerified: new Date().toISOString(),
      };
    });

    const payload = {
      source: "JKM InfoBencana",
      count: normalized.length,
      shelters: normalized,
    };

    cache = { ts: now, data: payload, key: cacheKey };

    res.json({
      ok: true,
      fromCache: false,
      fetchedAt: new Date(now).toISOString(),
      ...payload,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * GET /gov/jkm/nearby?lat=...&lng=...&radiusKm=30&limit=8
 * Returns nearby PPS with occupancy %
 */
router.get("/gov/jkm/nearby", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res
        .status(400)
        .json({ ok: false, error: "lat and lng are required numbers" });
    }

    const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 30;
    const limit = req.query.limit ? Number(req.query.limit) : 8;

    const shelters = await listNearbyPps({
      lat,
      lng,
      radiusKm: Number.isFinite(radiusKm) ? radiusKm : 30,
      limit: Number.isFinite(limit) ? limit : 8,
    });

    res.json({
      ok: true,
      source: "JKM InfoBencana",
      endpoint: "pusat-buka.php?a=0&b=0",
      count: shelters.length,
      shelters,
    });
  } catch (e) {
    console.error("JKM nearby error:", e);
    res.status(500).json({ ok: false, error: e.message || "JKM nearby failed" });
  }
});

module.exports = { jkmRoutes: router };