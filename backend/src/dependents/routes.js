//src/dependents/routes.js
const express = require("express");
const { requireAuth } = require("../auth/middleware");
const { listDependents, createDependent, updateDependent, deleteDependent } = require("./repo");

const router = express.Router();

router.get("/dependents", requireAuth, async (req, res) => {
  const items = await listDependents(req.user.uid);
  res.json({ ok: true, dependents: items });
});

router.post("/dependents", requireAuth, async (req, res) => {
  const item = await createDependent(req.user.uid, req.body || {});
  res.json({ ok: true, dependent: item });
});

router.put("/dependents/:id", requireAuth, async (req, res) => {
  const item = await updateDependent(req.user.uid, req.params.id, req.body || {});
  res.json({ ok: true, dependent: item });
});

router.delete("/dependents/:id", requireAuth, async (req, res) => {
  await deleteDependent(req.user.uid, req.params.id);
  res.json({ ok: true });
});

module.exports = router;