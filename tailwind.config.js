/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  purge: {
    enabled: true,
    content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  },
  theme: {
    extend: {
      width: {
        custom: "calc(100% - 260px)",
      },
      keyframes: {
        flash: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        spinOnce: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        flash: "flash 1.5s linear infinite",
        spinOnce: "spin 1s ease-in-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  variants: {},
  animation: ["responsive"],
};
