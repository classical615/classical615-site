import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // White/black base, softened with an off-white page tone, plus
        // accents and muted tints pulled from the Classical 615 palette.
        ink: "#111111",
        paper: "#FFFFFF",
        cream: "#FAF7F1",
        "paper-dim": "#F6F6F6",
        line: "#E4E4E4",
        muted: "#6B6B6B",

        red: "#D93A2B",
        "red-dark": "#9C2A1F",
        "red-tint": "#FBEAE7",

        purple: "#DF9BF2",
        "purple-dark": "#5B2A6B",
        "purple-tint": "#F6EBFA",

        green: "#2C4031",
        "green-tint": "#EAEEEB",

        yellow: "#D9CF43",
        "yellow-dark": "#5A5416",
        "yellow-tint": "#FBF9E7",

        orange: "#D97A43",
        "orange-dark": "#663717",
        "orange-tint": "#FBEFE6",
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
