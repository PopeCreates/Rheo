/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        sm: "480px",
        md: "640px",
        lg: "1024px",
        xl: "1280px",
      },
      colors: {
        // Bunny Theme - Primary Pink Palette
        primary: {
          DEFAULT: "#fecfd5",
          dark: "#fba4b0",
          accent: "#f0428b",
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
        },
        // Rose accents
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          900: "#881337",
        },
        // Backgrounds
        background: {
          light: "#fdfbfc",
          dark: "#1a0d13",
          DEFAULT: "#fdfbfc",
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#1e1118",
        },
        card: {
          DEFAULT: "#ffffff",
          dark: "#261820",
        },
        // Text
        text: {
          DEFAULT: "#1a0b12",
          light: "#fff9fb",
          secondary: "#64748b",
          muted: "#94a3b8",
        },
        // Borders
        border: {
          DEFAULT: "#fce7f3",
          light: "rgba(254, 207, 213, 0.3)",
          dark: "#3d2832",
        },
        // Status
        success: "#22c55e",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
        // Phase colors
        menstrual: "#f43f5e",
        follicular: "#a78bfa",
        ovulation: "#22c55e",
        luteal: "#fbbf24",
        // Indigo accents
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          900: "#312e81",
        },
        // Slate for neutrals
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        display: ["PlusJakartaSans", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        sans: ["PlusJakartaSans", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        "bunny": "0 4px 20px rgba(254, 207, 213, 0.5)",
        "bunny-lg": "0 8px 30px rgba(254, 207, 213, 0.6)",
        "card": "0 2px 10px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bunny-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bunny-float": "bunny-float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("nativewind/preset")],
}
