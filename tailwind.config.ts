import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hmi: {
          bg: "#070a0e",
          panel: "#0f1622",
          card: "#162030",
          border: "#23334a",
          "border-subtle": "#1b283a",
          muted: "#475569",
          text: "#f1f5f9",
          "text-muted": "#94a3b8",
          "text-dim": "#64748b",
          primary: "#06b6d4", // Cyan
          "primary-hover": "#0891b2",
          success: "#10b981", // Green
          warning: "#f59e0b", // Amber
          danger: "#ef4444", // Red
          "danger-hover": "#dc2626",
          accent: "#3b82f6", // Royal Blue
        },
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        "hmi-glow-green": "0 0 20px -3px rgba(16, 185, 129, 0.4)",
        "hmi-glow-cyan": "0 0 20px -3px rgba(6, 182, 212, 0.4)",
        "hmi-glow-amber": "0 0 20px -3px rgba(245, 158, 11, 0.4)",
        "hmi-glow-red": "0 0 20px -3px rgba(239, 68, 68, 0.4)",
        "hmi-card": "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "laser-scan": "laser 2s linear infinite",
      },
      keyframes: {
        laser: {
          "0%": { transform: "translateY(0%)", opacity: "0.2" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateY(100%)", opacity: "0.2" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
