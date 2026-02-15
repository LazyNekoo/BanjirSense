const admin = require("firebase-admin");
const path = require("path");

// Always load local service account JSON
const serviceAccount = require(
  path.join(__dirname, "../keys/serviceAccount.json")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id, 
  });
}

const db = admin.firestore();

// ------ Stranded reports ------

async function addStrandedReport({ lat, lng, peopleCount, specialNeeds, note }) {
  const doc = await db.collection("stranded_reports").add({
    lat,
    lng,
    peopleCount,
    specialNeeds,
    note,
    status: "ACTIVE",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return doc.id;
}

async function listStrandedReports({ status = "ACTIVE", limit = 200 }) {
  const snap = await db
    .collection("stranded_reports")
    .where("status", "==", status)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

module.exports = { db, addStrandedReport, listStrandedReports };
