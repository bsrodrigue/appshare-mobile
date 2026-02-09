import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onChangePhoneNumber: (text: string) => void;
  disabled?: boolean;
  error?: string;
}

export const PhoneInput = React.memo<PhoneInputProps>(
  ({ countryCode, phoneNumber, onChangePhoneNumber, disabled, error }) => {
    // Strip country code from display value if present
    const displayValue = phoneNumber.startsWith(countryCode)
      ? phoneNumber.slice(countryCode.length)
      : phoneNumber;

    const handleChangeText = (text: string) => {
      // Allow only numbers
      const cleaned = text.replace(/[^0-9]/g, '');
      // Always prepend country code for the parent component
      onChangePhoneNumber(`${countryCode}${cleaned}`);
    };

    return (
      <View style={styles.container}>
        <View style={styles.phoneContainer}>
          <View style={styles.countryCodeContainer}>
            <Text style={styles.flag}>🇧🇫</Text>
            <Text style={styles.countryCode}>{countryCode}</Text>
          </View>
          <TextInput
            style={[styles.phoneInput, error && styles.phoneInputError]}
            placeholder="Numéro de téléphone"
            placeholderTextColor={theme.colors.placeholder}
            value={displayValue}
            onChangeText={handleChangeText}
            keyboardType="phone-pad"
            editable={!disabled}
            autoComplete="tel"
            accessibilityLabel="Phone number"
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  countryCodeContainer: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    minWidth: 100,
    height: 48,
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  phoneInput: {
    flex: 1,
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
  phoneInputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});