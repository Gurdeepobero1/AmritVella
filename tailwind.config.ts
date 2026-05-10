import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#07111f",
          900: "#0a1728",
          800: "#10243d",
          700: "#173456"
        },
        saffron: {
          500: "#f2a51a",
          600: "#d98d06"
        },
        steel: {
          50: "#f7f8fa",
          100: "#e8edf2",
          300: "#aab7c5",
          500: "#687789",
          700: "#334155"
        },
        paper: "#fbfaf4"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(7, 17, 31, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
