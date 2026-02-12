const admin = require("firebase-admin");
const { FIREBASE_PROJECT_ID } = require("./config");

if (!admin.apps.length) {
  // Works on GCP automatically. Locally requires:
  // gcloud auth application-default login
  admin.initializeApp({ projectId: FIREBASE_PROJECT_ID });
}

const db = admin.firestore();

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
