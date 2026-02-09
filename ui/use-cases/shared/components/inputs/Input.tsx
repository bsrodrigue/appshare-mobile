import React from 'react';
import { View, TextInput, Text, StyleSheet, type TextInputProps } from 'react-native';
import { theme } from '@/ui/theme';

interface InputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  error?: string;
}

export const Input = React.memo<InputProps>(
  ({ placeholder, value, onChangeText, disabled, error, ...props }) => (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 48,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
