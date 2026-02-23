//src/users/routes.js
const express = require("express");
const { requireAuth } = require("../auth/middleware");
const { getUserProfile, upsertUserProfile } = require("./repo");

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const profile = await getUserProfile(req.user.uid);
  res.json({ ok: true, profile: profile || null });
});

router.put("/me", requireAuth, async (req, res) => {
  const uid = req.user.uid;
  const data = req.body || {};
  const saved = await upsertUserProfile(uid, data);
  res.json({ ok: true, profile: saved });
});

module.exports = router;