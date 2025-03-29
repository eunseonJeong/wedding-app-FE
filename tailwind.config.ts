module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ["Noto Serif KR", "serif"],
        sans: ["Noto Sans KR", "sans-serif"],
      },
    },
  },
  plugins: [],
};
