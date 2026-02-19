/**
 * Raw color tokens.
 * Prefer using NativeWind className for styling, but use these
 * when you need a literal hex (e.g. LinearGradient, SVG, etc.).
 */
export const Colors = {
  brand: "#f90680",
  brandLight: "rgba(249, 6, 128, 0.1)",
  brandMuted: "rgba(249, 6, 128, 0.6)",
  brandDark: "#d4056d",

  surface: "#fdf8fa",
  card: "#ffffff",
  soft: "#fff0f6",
  fertile: "#ffe3ec",

  text: "#181114",
  textSecondary: "#8c5f75",
  textMuted: "rgba(24, 17, 20, 0.5)",
  white: "#ffffff",
  black: "#000000",

  border: "#fce7f3",
  borderLight: "rgba(249, 6, 128, 0.1)",

  blue: "#3b82f6",
  indigo: "#6366f1",
  yellow: "#fbbf24",
  green: "#22c55e",
  progressTrack: "#e6dbe0",
} as const;
