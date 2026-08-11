import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Exact palette hex codes — no muting. Used directly as section
        // backgrounds (header, hero, footer), with the card grid kept
        // white/cream so dense event text stays easy to read.
        ink: "#111111",
        paper: "#FFFFFF",
        cream: "#FAF7F1",
        "paper-dim": "#F6F6F6",
        line: "#E4E4E4",
        muted: "#6B6B6B",

        red: "#D93A2B",
        purple: "#DF9BF2",
        "purple-dark": "#3A1A45",
        "purple-pale": "#F3E4FA",
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
