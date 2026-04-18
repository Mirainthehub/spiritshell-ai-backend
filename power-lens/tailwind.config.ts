import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0c0e12",
          raised: "#12151c",
          overlay: "#181c26",
          border: "#252a36",
        },
        accent: {
          DEFAULT: "#c9a962",
          muted: "#8a7548",
          glow: "rgba(201, 169, 98, 0.12)",
        },
        ink: {
          primary: "#e8eaef",
          secondary: "#9aa3b2",
          faint: "#5c6575",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.45)",
        glow: "0 0 60px rgba(201, 169, 98, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "pulse-subtle": "pulseSubtle 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
