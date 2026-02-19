const admin = require("firebase-admin");

//to verify Firebase tokens 
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer (.+)$/);

    if (!match) return res.status(401).json({ error: "Missing Bearer token" });

    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.user = decoded; // uid, email, phone_number, name...
    return next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid/expired token" });
  }
}

module.exports = { requireAuth };
