import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F5A623",
          dark: "#1a1a1a",
          light: "#FFF8ED",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "pulse-alert": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
            textShadow: "0 0 0px rgba(248,113,113,0)",
          },
          "50%": {
            transform: "scale(1.5)",
            opacity: "1",
            textShadow: "0 0 18px rgba(248,113,113,0.9), 0 0 32px rgba(248,113,113,0.5)",
          },
        },
      },
      animation: {
        "pulse-alert": "pulse-alert 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;