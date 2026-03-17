// src/sos/routes.js
const express = require("express");
const { requireAuth } = require("../auth/middleware");
const { activateSOS } = require("./service");

const router = express.Router();

/**
 * POST /sos/activate
 * Body:
 * { lat, lng, peopleCount?, specialNeeds?, note?, photoDataUrl? }
 */
router.post("/sos/activate", requireAuth, async (req, res) => {
  try {
    const result = await activateSOS(req.body || {});
    return res.json({ ok: true, ...result });
  } catch (e) {
    const status = e.statusCode || 500;
    return res.status(status).json({ ok: false, error: e.message || "sos activate failed" });
  }
});

module.exports = router;