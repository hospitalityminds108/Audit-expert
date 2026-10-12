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
        // Canvas / surface scale — base-950 is the page canvas (white → mint)
        base: {
          950: "#FFFFFF",
          900: "#F5FBF8",
          800: "#E8F5EE",
          700: "#D5EBDF",
          600: "#B9DCCA",
          500: "#9AC8B2",
          400: "#7CB39A",
          300: "#5F987F"
        },
        // Foreground scale — deep forest, never pure black; fg-50 is strongest
        fg: {
          50: "#0F2A1F",
          100: "#143326",
          200: "#1F3D30",
          300: "#2F4D40",
          400: "#567265",
          500: "#6A8478"
        },
        // Brand green
        brand: {
          100: "#E4F8ED",
          200: "#C6F0DA",
          300: "#8FE0B8",
          400: "#3CCB8E",
          500: "#12A46B",
          600: "#0B8455",
          700: "#076642"
        },
        // Green used for text and icons on the white canvas
        accent: "#0A7A4E",
        // Text placed on solid brand fills
        "on-brand": "#FFFFFF",
        // Secondary: teal, for the second audit format and supporting states
        aqua: {
          100: "#E0F5F4",
          300: "#B5E6E3",
          400: "#5CC4BF",
          500: "#14958F",
          600: "#0E7772",
          700: "#0A5C58"
        },
        critical: "#C73B3B"
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      fontSize: {
        // Fluid type scale using clamp()
        "display-2xl": ["clamp(3.5rem, 9vw, 9rem)", { lineHeight: "0.95", letterSpacing: "0" }],
        "display-xl": ["clamp(3rem, 7.5vw, 7.5rem)", { lineHeight: "0.98", letterSpacing: "0" }],
        "display-lg": ["clamp(2.5rem, 5.8vw, 5.5rem)", { lineHeight: "1.0", letterSpacing: "0" }],
        "display-md": ["clamp(2rem, 4.2vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "0" }],
        "display-sm": ["clamp(1.6rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "0" }],
        "lead-lg": ["clamp(1.05rem, 1.35vw, 1.25rem)", { lineHeight: "1.65" }],
        "lead": ["clamp(1rem, 1.15vw, 1.125rem)", { lineHeight: "1.7" }]
      },
      opacity: {
        "6": "0.06",
        "8": "0.08",
        "12": "0.12",
        "72": "0.72"
      },
      spacing: {
        "4.5": "1.125rem",
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
