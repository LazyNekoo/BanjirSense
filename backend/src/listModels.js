const { GEMINI_API_KEY } = require("./config");

// Node 18 has global fetch
async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

module.exports = { listModels };
