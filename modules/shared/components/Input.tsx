import React, { useMemo } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { useTheme, type Theme } from "@/ui/theme";

interface InputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
}

export const Input = React.memo<InputProps>(
  ({
    placeholder,
    value,
    onChangeText,
    disabled,
    error,
    label,
    style,
    ...props
  }) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
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
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

Input.displayName = "Input";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
      width: "100%",
    },
    label: {
      color: theme.colors.text,
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      marginBottom: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.md,
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
    errorText: {
      color: theme.colors.error,
      fontSize: theme.fontSize.xs,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
  });
