import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Direction B: black and white, built from the real logo art, with
        // one accent color (red, sampled from the logo) doing all the work
        // that color would otherwise do.
        ink: "#111111",
        "ink-soft": "#1B1B1B",
        "ink-line": "#2E2E2E",
        paper: "#FFFFFF",
        "paper-dim": "#F4F4F4",
        "paper-line": "#E2E2E2",
        red: "#D10D07",
        "red-bright": "#EB2A21",
        cream: "#FFFFFF",
        "cream-dim": "#9A9A9A",
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
