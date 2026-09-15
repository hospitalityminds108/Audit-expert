import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#163C32",
          900: "#102F28",
          800: "#1D4A3D",
          700: "#2A5B4B",
          600: "#3A6B5A",
          500: "#527565",
          400: "#718B7D",
          300: "#8FA99A"
        },
        bone: {
          50: "#FFFFFF",
          100: "#F7F3EA",
          200: "#E6E1D8",
          300: "#D8D2C5",
          400: "#9AA69B",
          500: "#6F7C73"
        },
        brass: {
          200: "#F1D99D",
          300: "#E6C778",
          400: "#D5A84B",
          500: "#B98B2F",
          600: "#8A6720",
          700: "#674B18"
        },
        sage: {
          300: "#DCE7DF",
          400: "#A9C7B7",
          500: "#138A6A",
          600: "#0D6F55"
        },
        forest: "#163C32",
        emerald: "#138A6A",
        champagne: "#D5A84B",
        ivory: "#F7F3EA",
        charcoal: "#27312D",
        warmgray: "#E6E1D8"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      fontSize: {
        // Fluid type scale using clamp()
        "display-2xl": ["clamp(3.5rem, 9vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(3rem, 7.5vw, 7.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 5.8vw, 5.5rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4.2vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.6rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "lead-lg": ["clamp(1.05rem, 1.35vw, 1.25rem)", { lineHeight: "1.65" }],
        "lead": ["clamp(1rem, 1.15vw, 1.125rem)", { lineHeight: "1.7" }]
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "screen-safe": "calc(100svh - var(--header-h))"
      },
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem"
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
        "premium-in-out": "cubic-bezier(0.65, 0, 0.35, 1)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "scan-line": "scan-line 3.5s linear infinite"
      }
    }
  },
  plugins: []
};
export default config;
