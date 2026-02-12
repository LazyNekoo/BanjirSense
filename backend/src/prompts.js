function prepPromptBM({ riskLevel, hoursAhead, locationHint }) {
  return `
Anda ialah pembantu kesiapsiagaan banjir untuk Malaysia.
Tulis dalam Bahasa Melayu ringkas, jelas, dan boleh dibuat segera.

Maklumat:
- Lokasi (anggaran): ${locationHint}
- Risiko banjir: ${riskLevel}
- Anggaran masa: ${hoursAhead} jam

Beri (5-8 bullet):
1) Apa perlu sediakan (dokumen, ubat, power bank, makanan, air)
2) Apa perlu buat pada rumah/kenderaan
3) Bila perlu berpindah (kalau risiko tinggi)
`.trim();
}

function strandedPromptBM({ peopleCount, specialNeeds, locationHint }) {
  const needs = Array.isArray(specialNeeds) ? specialNeeds.join(", ") : "";
  return `
Anda ialah pembantu kecemasan banjir (mode terkandas) untuk Malaysia.
Tulis dalam Bahasa Melayu, sangat ringkas, fokus keselamatan.

Maklumat:
- Lokasi (anggaran): ${locationHint}
- Bilangan orang: ${peopleCount}
- Keperluan khas: ${needs || "tiada"}

Beri arahan keselamatan segera (6-10 bullet):
- kekal di tempat tinggi
- elak arus deras
- jimat bateri
- sediakan info untuk pasukan penyelamat
- bila perlu hubungi 999
`.trim();
}

module.exports = { prepPromptBM, strandedPromptBM };
