/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-yellow": "#faf7ef",
        "custom-white": "#f5f5f5",
      },
    },
  },
  plugins: [],
};
