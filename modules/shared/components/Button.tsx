import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  TextStyle,
  StyleProp,
} from "react-native";
import { theme } from "@/ui/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
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
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.disabled;
    switch (variant) {
      case "secondary":
        return "transparent";
      case "outline":
        return "transparent";
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return theme.colors.primary; // For "Renvoyer SMS" style links
      case "outline":
        return theme.colors.textWhite;
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

const styles = StyleSheet.create({
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
    borderColor: theme.colors.textWhite,
  },
  text: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
