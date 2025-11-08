/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "lol-gold": "rgb(255, 206, 52)",
        "lol-client-bg": "#06242c",
        "lol-accent": "#117b8b",
        "lol-gray": "#1a1e31",
      },
    },
  },
  plugins: [],
};
