module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "rgba(0, 140, 255, 0.3)",
        secondary: {
          100: "#7dc7ff",
          200: "#0390fc"
        },
        transparent: {
          100: "rgba(255,255,255,0.3)",
          200: "rgba(255,255,255,0.6)",
          300: "rgba(255,255,255,0.9)",
        },
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
