//src/dependents/repo.js
const { admin, db } = require("../firebaseAdmin");

function depCol(uid) {
  return db.collection("users").doc(uid).collection("dependents");
}

async function listDependents(uid) {
  const snap = await depCol(uid).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function createDependent(uid, data) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const doc = await depCol(uid).add({ ...data, createdAt: now, updatedAt: now });
  const saved = await doc.get();
  return { id: saved.id, ...saved.data() };
}

async function updateDependent(uid, id, data) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  await depCol(uid).doc(id).set({ ...data, updatedAt: now }, { merge: true });
  const snap = await depCol(uid).doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function deleteDependent(uid, id) {
  await depCol(uid).doc(id).delete();
  return true;
}

module.exports = { listDependents, createDependent, updateDependent, deleteDependent };