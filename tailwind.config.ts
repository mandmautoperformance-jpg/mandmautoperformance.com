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
        // Luxury palette — deep piano black base with champagne-gold accents.
        // Token names are kept (performance-*) so the whole site reskins from
        // this one place without touching every component.
        gunmetal: "#16181C",
        "electric-turquoise": "#C5A572", // champagne gold (accent)
        "baby-blue": "#E3CFA1", // light champagne (secondary accent)
        "dark-gunmetal": "#0B0C0E",
        "light-gunmetal": "#22252A",
        "performance-grey": "#121316", // rich near-black base
        "performance-turquoise": "#C5A572", // champagne gold (primary accent)
        "performance-babyblue": "#E3CFA1", // light champagne / platinum-gold
        "performance-gold": "#C5A572",
        "performance-gold-light": "#E3CFA1",
        "performance-gold-deep": "#A9863F",
        "performance-ink": "#0B0C0E",
        "performance-panel": "#1A1C21",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
        "turquoise-gradient":
          "linear-gradient(135deg, #E3CFA1 0%, #C5A572 50%, #A9863F 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #E3CFA1 0%, #C5A572 50%, #A9863F 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #0B0C0E 0%, #16181C 55%, #2a2114 100%)",
      },
      backdropFilter: {
        glass: "blur(10px)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      boxShadow: {
        glass:
          "0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "glass-light":
          "0 8px 32px 0 rgba(197, 165, 114, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
        gold: "0 10px 40px -10px rgba(197, 165, 114, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
