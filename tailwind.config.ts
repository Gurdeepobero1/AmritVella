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
          950: "#262622",
          900: "#33332e",
          800: "#62625b",
          700: "#91918c"
        },
        saffron: {
          500: "#e60023",
          600: "#cc001f"
        },
        steel: {
          50: "#fbfbf9",
          100: "#f6f6f3",
          300: "#dadad3",
          500: "#62625b",
          700: "#33332e"
        },
        paper: "#ffffff",
        canvas: "#ffffff",
        cream: "#fbfbf9",
        card: "#f6f6f3",
        hairline: "#dadad3"
      },
      boxShadow: {
        soft: "0 16px 42px rgba(38, 38, 34, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
