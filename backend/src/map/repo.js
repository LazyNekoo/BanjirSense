// src/map/repo.js
const { admin, db } = require("../firebaseAdmin");

// Firestore collection name for stranded reports
const STRANDED_COL = "stranded_reports";

async function addStrandedReport({
  lat,
  lng,
  peopleCount,
  specialNeeds,
  note,
  uid = null,
}) {
  const doc = await db.collection(STRANDED_COL).add({
    lat,
    lng,
    peopleCount,
    specialNeeds,
    note,
    uid,
    status: "ACTIVE",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return doc.id;
}

//index DB 
async function listStrandedReports({ status = "ACTIVE", limit = 200 }) {
  const snap = await db
    .collection(STRANDED_COL)
    .where("status", "==", status)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

module.exports = { addStrandedReport, listStrandedReports };
