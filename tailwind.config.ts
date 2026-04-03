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
        gunmetal: "#2C2F33",
        "electric-turquoise": "#00CED1",
        "baby-blue": "#89CFF0",
        "dark-gunmetal": "#1A1C1E",
        "light-gunmetal": "#3D4147",
        "performance-grey": "#2C2F33",
        "performance-turquoise": "#00CED1",
        "performance-babyblue": "#89CFF0",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "turquoise-gradient":
          "linear-gradient(135deg, #00CED1 0%, #00B0A0 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #2C2F33 0%, #1A1C1E 50%, #00CED1 100%)",
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
      },
      boxShadow: {
        glass:
          "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 8px 16px 0 rgba(255, 255, 255, 0.2)",
        "glass-light":
          "0 8px 32px 0 rgba(0, 206, 209, 0.2), inset 0 8px 16px 0 rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
