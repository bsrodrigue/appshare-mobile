import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { theme } from "@/ui/theme";
import { Ionicons } from "@expo/vector-icons";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  error?: string;
}

export const PasswordInput = React.memo<PasswordInputProps>(
  ({ placeholder, value, onChangeText, disabled, error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, error && styles.inputError]}
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
            {showPassword ? (
              <Ionicons name="eye" size={20} color={theme.colors.text} />
            ) : (
              <Ionicons name="eye-off" size={20} color={theme.colors.text} />
            )}
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
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
    borderColor: "transparent",
    height: 48,
  },
  inputError: {
    borderColor: theme.colors.error,
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
  eyeText: {
    fontSize: 20,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
