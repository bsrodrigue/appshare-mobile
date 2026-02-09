const palette = {
  // Base colors
  darkBlue: "#10131f",
  lightBlue: "#00bfff",
  orange: "#ff6b4a",
  red: "#FF3B30",
  white: "#ffffff",
  black: "#000000",

  // Grays
  gray100: "#f5f5f5",
  gray200: "#d3d3d3",
  gray300: "#ccc",
  gray400: "#999",
  gray500: "#666",
  gray800: "#333",

  // Specific UI colors
  splashBlue: "#4FA4F4",
};

export const theme = {
  colors: {
    // Backgrounds
    background: palette.darkBlue,
    whiteBackground: palette.white,
    surface: "rgba(255,255,255,0.08)",
    inputBackground: palette.gray200,
    cardBackground: "rgba(255,255,255,0.05)",

    // Text
    text: palette.gray800,
    textLight: palette.gray300,
    textWhite: palette.white,
    placeholder: palette.gray400,

    // Brand
    primary: palette.lightBlue,
    accent: palette.orange,
    splashBackground: palette.splashBlue,

    // Feedback
    error: palette.red,
    disabled: palette.gray500,

    // UI Elements
    border: "rgba(255,255,255,0.1)",
    otpBox: "#E0E0E0",
    otpBoxActive: palette.white,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 60,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 15,
    base: 16,
    lg: 24,
    xl: 28,
    xxl: 48,
  },
  fontWeight: {
    normal: "400" as const,
    medium: "600" as const,
    bold: "700" as const,
  },
  // Font Families - centralized here for easy swapping
  fontFamily: {
    regular: "System", // Swap with 'Inter-Regular' or similar
    medium: "System", // Swap with 'Inter-Medium'
    bold: "System", // Swap with 'Inter-Bold'
    heading: "System", // Swap with 'Outfit-Bold' or similar
  },
};

// Helper for consistent text styles
export const typography = {
  h1: {
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fontFamily.heading,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
  },
  h2: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fontFamily.heading,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
  },
  h3: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.heading,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textWhite,
  },
  body: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text,
  },
  bodySmall: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.textLight,
  },
  button: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily.medium,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1,
  },
};
