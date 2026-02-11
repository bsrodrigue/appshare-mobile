import { ColorSchemeName, useColorScheme } from "react-native";

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

  // Dark specific
  darkSurface: "rgba(255,255,255,0.08)",
  darkCard: "rgba(255,255,255,0.05)",
  darkBorder: "rgba(255,255,255,0.1)",

  // Light specific
  lightSurface: "#f9f9f9",
  lightCard: "#ffffff",
  lightBorder: "#e0e0e0",

  // Specific UI colors
  splashBlue: "#4FA4F4",
};

const lightColors = {
  background: palette.white,
  surface: palette.lightSurface,
  inputBackground: palette.gray100,
  cardBackground: palette.lightCard,
  text: palette.gray800,
  textLight: palette.gray500,
  textWhite: palette.white,
  textInverse: palette.white,
  placeholder: palette.gray400,
  primary: palette.lightBlue,
  accent: palette.orange,
  splashBackground: palette.splashBlue,
  error: palette.red,
  disabled: palette.gray300,
  border: palette.lightBorder,
  otpBox: palette.gray200,
  otpBoxActive: palette.lightBlue,
};

const darkColors = {
  background: palette.darkBlue,
  surface: palette.darkSurface,
  inputBackground: palette.gray800,
  cardBackground: palette.darkCard,
  text: palette.white,
  textLight: palette.gray300,
  textWhite: palette.white,
  textInverse: palette.gray800,
  placeholder: palette.gray500,
  primary: palette.lightBlue,
  accent: palette.orange,
  splashBackground: palette.splashBlue,
  error: palette.red,
  disabled: palette.gray500,
  border: palette.darkBorder,
  otpBox: "#2a2d3a",
  otpBoxActive: palette.white,
};

const sharedTheme = {
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
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
    heading: "System",
  },
};

export const ThemeService = {
  getTheme: (scheme: ColorSchemeName) => {
    const isDark = scheme === "dark";
    const colors = isDark ? darkColors : lightColors;

    return {
      ...sharedTheme,
      colors,
      isDark,
    };
  },
};

// Default theme for non-hook usage (Server side or background)
export const theme = ThemeService.getTheme("dark");

export const useTheme = () => {
  const scheme = useColorScheme();
  return ThemeService.getTheme(scheme);
};

export type Theme = ReturnType<typeof ThemeService.getTheme>;

// Helper for consistent text styles
export const getTypography = (currentTheme: Theme) => ({
  h1: {
    fontSize: currentTheme.fontSize.xxl,
    fontFamily: currentTheme.fontFamily.heading,
    fontWeight: currentTheme.fontWeight.bold,
    color: currentTheme.colors.text,
  },
  h2: {
    fontSize: currentTheme.fontSize.xl,
    fontFamily: currentTheme.fontFamily.heading,
    fontWeight: currentTheme.fontWeight.bold,
    color: currentTheme.colors.text,
  },
  h3: {
    fontSize: currentTheme.fontSize.lg,
    fontFamily: currentTheme.fontFamily.heading,
    fontWeight: currentTheme.fontWeight.medium,
    color: currentTheme.colors.text,
  },
  body: {
    fontSize: currentTheme.fontSize.base,
    fontFamily: currentTheme.fontFamily.regular,
    color: currentTheme.colors.text,
  },
  bodySmall: {
    fontSize: currentTheme.fontSize.sm,
    fontFamily: currentTheme.fontFamily.regular,
    color: currentTheme.colors.textLight,
  },
  button: {
    fontSize: currentTheme.fontSize.base,
    fontFamily: currentTheme.fontFamily.medium,
    fontWeight: currentTheme.fontWeight.bold,
    letterSpacing: 1,
  },
});
