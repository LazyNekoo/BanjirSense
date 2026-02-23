/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",
        "safety-blue": "#1e3a8a",
        "safe-green": "#22c55e",
        "hazard-red": "#ef4444",
        "neutral-surface": "#f8fafc",
        "dark-text": "#0f172a",
        "light-text": "#64748b",
        "off-white": "#f8fafc",
        "soft-blue": "#eff6ff",
        "trust-green": "#10b981",
        "dark-navy": "#0f172a",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
      },
      letterSpacing: {
        "ultra-wide": "0.4em",
      },
      borderRadius: {
        "24px": "24px",
      },
    },
  },
  plugins: [],
};
