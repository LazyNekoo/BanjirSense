require("dotenv").config();

module.exports = {
  PROJECT_ID: process.env.PROJECT_ID || "",
  REGION: process.env.REGION || "asia-southeast1",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-1.5-flash",

  VERTEX_ENDPOINT_ID: process.env.VERTEX_ENDPOINT_ID || "",

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || process.env.PROJECT_ID || "",
};
