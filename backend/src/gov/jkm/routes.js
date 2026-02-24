//src/gov/jkm/routes.js
const express = require("express");

const router = express.Router();

const JKM_URL = "https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php";
const CACHE_TTL_MS = 5 * 60 * 1000;

let cache = {
  ts: 0,
  data: null,
  key: "",
};

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
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": "https://infobencanajkmv2.jkm.gov.my/",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: "JKM fetch failed" });
    }

    const raw = await response.json();
    const points = Array.isArray(raw.points) ? raw.points : [];

    const normalized = points.map((p) => ({
      id: Number(p.id),
      name: p.name,
      lat: Number(p.latti),
      lng: Number(p.longi),
      state: p.negeri,
      district: p.daerah,
      mukim: p.mukim,
      disaster: p.bencana,
      victims: Number(p.mangsa),
      families: Number(p.keluarga),
      capacityPct: Number(p.kapasiti),
      capacityStatus:
        p.kapasiti < 30
          ? "LOW"
          : p.kapasiti < 70
          ? "MEDIUM"
          : "HIGH",
    }));

    const payload = {
      source: "JKM InfoBencana",
      count: normalized.length,
      points: normalized,
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

module.exports = router;