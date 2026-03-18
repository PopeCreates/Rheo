/**
 * Bunny Assistant Theme - Color Tokens
 * Soft pink theme with the cute bunny mascot aesthetic.
 * Prefer using NativeWind className for styling, but use these
 * when you need a literal hex (e.g. LinearGradient, SVG, etc.).
 */
export const Colors = {
  // Primary - Soft Pink Bunny Theme
  primary: "#fecfd5",
  primaryDark: "#fba4b0",
  primaryAccent: "#f0428b",
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
  backgroundLight: "#fdfbfc",
  backgroundDark: "#1a0d13",
  surface: "#ffffff",
  surfaceDark: "#1e1118",
  card: "#ffffff",
  cardDark: "#261820",

  // Soft accent backgrounds
  soft: "#fff9fb",
  fertile: "#ffe4ec",
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    500: "#6366f1",
    900: "#312e81",
  },

  // Text
  text: "#1a0b12",
  textLight: "#fff9fb",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  white: "#ffffff",
  black: "#000000",

  // Borders
  border: "#fce7f3",
  borderLight: "rgba(254, 207, 213, 0.3)",
  borderDark: "#3d2832",

  // Status colors
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",

  // Phase colors
  menstrual: "#f43f5e",
  follicular: "#a78bfa",
  ovulation: "#22c55e",
  luteal: "#fbbf24",

  // Utility
  progressTrack: "#fce7f3",
  shadow: "rgba(254, 207, 213, 0.5)",
} as const;
