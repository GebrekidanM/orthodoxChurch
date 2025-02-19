/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        jiret: ["Jiret", "sans-serif"],
        saban:["Saban","sans-serif"],
        washera:["Washera","sans-serif"],
        hiwua:["Hiwua","sans-serif"],
        abysinica:["Abysinica","sans-serif"]
      },
    },
  },
  plugins: [],
};