import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0d10",
          soft: "#11151a",
          card: "#161b22",
          hover: "#1c222b",
        },
        border: {
          DEFAULT: "#222a34",
          soft: "#1a2029",
        },
        fg: {
          DEFAULT: "#e6edf3",
          muted: "#8b949e",
          subtle: "#6e7681",
        },
        risk: {
          low: "#3fb950",
          med: "#d29922",
          high: "#db6d28",
          crit: "#f85149",
        },
        accent: {
          DEFAULT: "#2f81f7",
          soft: "#1f6feb33",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: { lg: "10px", md: "8px", sm: "6px" },
    },
  },
  plugins: [],
};

export default config;
