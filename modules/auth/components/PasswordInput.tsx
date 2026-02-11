import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { useTheme, type Theme } from "@/ui/theme";
import { Ionicons } from "@expo/vector-icons";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  error?: string;
}

export const PasswordInput = React.memo<PasswordInputProps>(
  ({ placeholder, value, onChangeText, disabled, error, style, ...props }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              error && styles.inputError,
              disabled && styles.disabledInput,
              style,
            ]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.placeholder}
            value={value}
            onChangeText={onChangeText}
            editable={!disabled}
            secureTextEntry={!showPassword}
            {...props}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
      width: "100%",
    },
    inputContainer: {
      position: "relative",
    },
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.md,
      paddingRight: 48,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      height: 48,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    disabledInput: {
      opacity: 0.6,
    },
    eyeIcon: {
      position: "absolute",
      right: theme.spacing.md,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      width: 32,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.fontSize.xs,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
  });
