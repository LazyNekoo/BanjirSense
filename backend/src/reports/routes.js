const express = require("express");
const { requireAuth } = require("../auth/middleware");
const { admin, db } = require("../firebaseAdmin");

const router = express.Router();

router.post("/reports/community", requireAuth, async (req, res) => {
  const uid = req.user.uid;
  const { title, category, description, lat, lng, photoUrl = null } = req.body || {};
  if (!title || !category || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ ok: false, error: "title, category, lat, lng required" });
  }

  const doc = await db.collection("community_reports").add({
    uid,
    title,
    category,
    description: description || "",
    lat,
    lng,
    photoUrl,
    visionStatus: photoUrl ? "PENDING" : "NONE",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ ok: true, reportId: doc.id, status: "RECEIVED" });
});

module.exports = router;