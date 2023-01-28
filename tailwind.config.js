/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "header-pattern": "url('/src/assets/images/pattern-bg.png')",
      },
      colors: {
        "very-dark-gray": "hsl(0, 0%, 17%)",
        "dark-gray": "hsl(0, 0%, 59%)",
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
    screens: {
      // You can add more breakpoints as you need them
      // https://tailwindcss.com/docs/breakpoints
      mobile: "375px",
      // => @media (min-width: 375px) { ... }

      tablet: "640px",
      // => @media (min-width: 640px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }

      "desktop-xl": "1440px",
      // => @media (min-width: 1440px) { ... }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
