const express = require("express");
const { requireAuth } = require("./middleware");
const { verifyUser } = require("./service");

const router = express.Router();

// POST /auth/verify
router.post("/verify", requireAuth, async (req, res) => {
  try {
    const result = await verifyUser(req.user);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "auth verify failed" });
  }
});

module.exports = router;
