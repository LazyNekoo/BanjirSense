// src/user/repo.js
const { admin, db } = require("../firebaseAdmin");

function userRef(uid) {
  return db.collection("users").doc(uid);
}

async function getUserProfile(uid) {
  const snap = await userRef(uid).get();
  return snap.exists ? { uid: snap.id, ...snap.data() } : null;
}

async function upsertUserProfile(uid, data) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const ref = userRef(uid);
  const snap = await ref.get();

  const payload = {
    uid,
    ...data,
    updatedAt: now,
    ...(snap.exists ? {} : { createdAt: now }),
  };

  await ref.set(payload, { merge: true });
  return getUserProfile(uid);
}

module.exports = { getUserProfile, upsertUserProfile };
