/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f0f",
        card: "#1a1a1a",
        border: "#2a2a2a",
        accent: "#4f46e5"
      }
    }
  },
  plugins: [],
};
