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
          950: "#1f1d18",
          900: "#2f2b24",
          800: "#4a4439",
          700: "#6d6558"
        },
        saffron: {
          300: "#ffbe73",
          500: "#ff5a1f",
          600: "#d9470f",
          700: "#aa3308"
        },
        steel: {
          50: "#fffaf0",
          100: "#fff3d5",
          300: "#e8d8ad",
          500: "#746b5c",
          700: "#3b352c"
        },
        paper: "#ffffff",
        canvas: "#ffffff",
        cream: "#fff4d7",
        card: "#fff8e7",
        hairline: "#e7d7ae"
      },
      boxShadow: {
        soft: "0 12px 24px -4px rgba(31, 29, 24, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
