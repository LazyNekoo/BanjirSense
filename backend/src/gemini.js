const { GEMINI_API_KEY, GEMINI_MODEL } = require("./config");
const { prepPromptBM, strandedPromptBM } = require("./prompts");

// node-fetch v3 needs dynamic import in CommonJS:
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function callGemini(textPrompt) {
  if (!GEMINI_API_KEY) {
    return "⚠️ GEMINI_API_KEY belum diset.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: textPrompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini error: ${resp.status} ${errText}`);
  }

  const data = await resp.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "No response";

  return text.trim();
}

async function getPrepGuidanceBM(input) {
  return callGemini(prepPromptBM(input));
}

async function getStrandedGuidanceBM(input) {
  return callGemini(strandedPromptBM(input));
}

module.exports = { getPrepGuidanceBM, getStrandedGuidanceBM };
