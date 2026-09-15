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
          950: "#151917",
          900: "#1B211E",
          800: "#252C28",
          700: "#343D38",
          600: "#46514B",
          500: "#5F6B65",
          400: "#7D8781",
          300: "#A0A8A3"
        },
        bone: {
          50: "#FFFFFF",
          100: "#F8F7F2",
          200: "#E5E3DA",
          300: "#D8D8D0",
          400: "#9A9F9B",
          500: "#5F6662"
        },
        brass: {
          200: "#FFF3BE",
          300: "#F6E7A6",
          400: "#EFBF04",
          500: "#C99E00",
          600: "#9F7D00",
          700: "#725A00"
        },
        sage: {
          300: "#CDE8DC",
          400: "#7FBE9F",
          500: "#16845F",
          600: "#0F684B"
        },
        forest: "#151917",
        emerald: "#16845F",
        champagne: "#EFBF04",
        ivory: "#F8F7F2",
        charcoal: "#202522",
        warmgray: "#E5E3DA",
        critical: "#D64545"
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
