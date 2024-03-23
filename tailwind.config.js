/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-yellow": "#faf7ef",
        "custom-white": " #fbfbfa",
        "bg-white": "#f9fafb",
        selectbox: "#edf0f2",
      },
    },
  },
  plugins: [],
};
