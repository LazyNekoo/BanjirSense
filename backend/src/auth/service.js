const { getUserProfile } = require("../users/repo");

// logic for routes.js
async function verifyUser(decodedToken) {
  const uid = decodedToken.uid;
  const profile = await getUserProfile(uid);

  return {
    ok: true,
    uid,
    email: decodedToken.email || null,
    phoneNumber: decodedToken.phone_number || null,
    name: decodedToken.name || null,
    profileExists: !!profile,
    profile: profile || null,
  };
}

module.exports = { verifyUser };
