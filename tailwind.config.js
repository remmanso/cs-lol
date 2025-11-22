/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        nav: "50px",
      },
      colors: {
        "lol-gold": "rgb(255, 206, 52)",
        "lol-client-bg": "#06242c",
        "lol-accent": "#117b8b",
        "lol-gray": "#1a1e31",
        "lol-yellow": "#c28f2c",
      },
      screens: {
        xs: "20rem",
      },
      boxShadow: {
        cm: "0 0 10px 5px #00000073 ",
      },
      dropShadow: {
        outline: [, "-1px -1px 2px #000C", "1px -1px 2px #000C", "-1px 1px 2px #000C", "1px 1px 2px #000C"],
        "outline-gold": [
          "-1px -1px 2px #c28f2c22",
          "1px -1px 2px #c28f2c22",
          "-1px 1px 2px #c28f2c22",
          "1px 1px 2px #c28f2c22",
        ],
      },
    },
  },
  plugins: [],
};
