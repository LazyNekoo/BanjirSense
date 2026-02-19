// src/firebaseAdmin.js
const admin = require("firebase-admin");
const path = require("path");

// Always load local service account JSON
const serviceAccount = require(path.join(__dirname, "../keys/serviceAccount.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = admin.firestore();

module.exports = { admin, db };
