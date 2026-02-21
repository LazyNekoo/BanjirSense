/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",
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
    },
  },
  plugins: [],
};
