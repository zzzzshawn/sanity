import { fontFamily } from "tailwindcss/defaultTheme";
const defaultTheme = require("tailwindcss/defaultTheme");

import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

const svgToDataUri = require("mini-svg-data-uri");

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["app/**/*.{ts,tsx,js,jsx}", "components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4F46E5", // Indigo
          light: "#6C63FF",
          foreground: "hsl(var(--primary-foreground))",
          hover: "#4338CA",
        },
        secondary: {
          DEFAULT: "#E114E5", // Pink
          foreground: "hsl(var(--secondary-foreground))",
          hover: "#C026D3",
        },
        accent: {
          DEFAULT: "#18181B", // Dark gray
          foreground: "hsl(var(--accent-foreground))",
          hover: "#27272A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        mono: ["var(--font-helvetica)", ...fontFamily.mono],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: "aurora 60s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Add the tailwindcss-animate plugin
    addVariablesForColors,
    // function ({ matchUtilities, theme }: any) {
    //   matchUtilities(
    //     {
    //       "bg-dot-thick": (value: any) => ({
    //         backgroundImage: `url("${svgToDataUri(
    //           `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
    //         )}")`,
    //       }),
    //     },
    //     { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
    //   );
    // }, // Your custom plugin for color variables
  ],
};
