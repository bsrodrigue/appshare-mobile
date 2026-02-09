import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  linkText?: string;
  disabled?: boolean;
  error?: string;
}

export const Checkbox = React.memo<CheckboxProps>(
  ({ checked, onPress, label, linkText, disabled, error }) => (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>
          {label}{' '}
          {linkText && <Text style={styles.linkText}>{linkText}</Text>}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
);

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.inputBackground,
    borderRadius: 3,
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.inputBackground,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  linkText: {
    color: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xl,
  },
});