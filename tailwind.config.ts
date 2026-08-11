import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Direction C: white background, black text, accents pulled from
        // the Classical 615 palette swatches.
        ink: "#111111",
        "ink-soft": "#111111",
        paper: "#FFFFFF",
        "paper-dim": "#F6F6F6",
        line: "#E4E4E4",
        muted: "#6B6B6B",
        red: "#D93A2B",
        "red-dark": "#9C2A1F",
        purple: "#DF9BF2",
        "purple-dark": "#5B2A6B",
        green: "#2C4031",
        yellow: "#D9CF43",
        "yellow-dark": "#5A5416",
        orange: "#D97A43",
        "orange-dark": "#663717",
      },
      fontFamily: {
        display: ["var(--font-bungee)", "sans-serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        mono: ["var(--font-plexmono)", "monospace"],
      },
      letterSpacing: {
        widish: "0.03em",
        wide2: "0.1em",
        wide3: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
