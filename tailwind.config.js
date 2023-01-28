/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "Very Dark Gray": "hsl(0, 0%, 17%)",
        "Dark Gray": "hsl(0, 0%, 59%)",
      },
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
      },
      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
