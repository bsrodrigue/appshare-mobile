import React, { useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  TextStyle,
  StyleProp,
} from "react-native";
import { useTheme, type Theme } from "@/ui/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  textStyle?: StyleProp<TextStyle>;
  borderRadius?: number;
}

export const Button = ({
  title,
  variant = "primary",
  isLoading: loading = false,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.disabled;
    switch (variant) {
      case "ghost":
      case "secondary":
      case "outline":
        return "transparent";
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textLight;
    switch (variant) {
      case "ghost":
      case "secondary":
        return theme.colors.primary;
      case "outline":
        return theme.colors.text;
      default:
        return theme.colors.textWhite;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === "outline" && styles.outlineButton,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 200,
    },
    outlineButton: {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    text: {
      fontSize: theme.fontSize.base,
      fontWeight: theme.fontWeight.bold,
      letterSpacing: 0.5,
    },
  });
