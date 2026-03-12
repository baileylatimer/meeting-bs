/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#EDE8E1",
        ink: "#0A0A0A",
        danger: "#D72638",
        coral: "#FF6B6B",
        gold: "#F2C744",
        muted: "#999999",
        rule: "#D5D0CB",
        fill: "#E8E3DE",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "Courier New", "monospace"],
        sans: ["PP Neue Montreal", "Neue Montreal", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        brutal: "8px 8px 0 #0A0A0A",
        "brutal-sm": "4px 4px 0 #0A0A0A",
        "brutal-red": "8px 8px 0 #D72638",
      },
      backgroundImage: {
        "ruled": "repeating-linear-gradient(to bottom, transparent, transparent 27px, #D5D0CB 27px, #D5D0CB 28px)",
      },
    },
  },
  plugins: [],
}
