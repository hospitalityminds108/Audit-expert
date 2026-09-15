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
          950: "#0A0B0E",
          900: "#0E1013",
          800: "#15181D",
          700: "#1D2127",
          600: "#262B33",
          500: "#31373F",
          400: "#434B55",
          300: "#5D6672"
        },
        bone: {
          50: "#FAFAF7",
          100: "#F3F2EC",
          200: "#E8E6DD",
          300: "#D6D3C4",
          400: "#B9B5A3",
          500: "#948F7C"
        },
        brass: {
          200: "#EAD9A8",
          300: "#DCC37D",
          400: "#C9A54B",
          500: "#B08A2E",
          600: "#8C6E22",
          700: "#6A5218"
        },
        sage: {
          300: "#9DB8A9",
          400: "#7DA390",
          500: "#5C8871",
          600: "#48705B"
        }
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
