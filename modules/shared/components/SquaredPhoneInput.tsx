import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { theme } from '@/ui/theme';

interface SquaredPhoneInputProps {
    countryCode: string;
    phoneNumber: string;
    onChangePhoneNumber: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    flagColors?: { top: string; bottom: string };
}

export const SquaredPhoneInput = React.memo<SquaredPhoneInputProps>(
    ({
        countryCode,
        phoneNumber,
        onChangePhoneNumber,
        placeholder = 'Numéro de téléphone',
        disabled = false,
        error,
        flagColors = { top: 'red', bottom: 'green' },
    }) => {
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
                <View style={styles.phoneRow}>
                    <View style={[styles.prefixContainer, error && styles.prefixContainerError]}>
                        <Text style={styles.prefixText}>Préfixe</Text>
                        <View style={styles.flagRow}>
                            <View style={styles.flag}>
                                <View style={{ flex: 1, backgroundColor: flagColors.top }} />
                                <View style={{ flex: 1, backgroundColor: flagColors.bottom }} />
                            </View>
                            <Text style={styles.countryCode}>{countryCode}</Text>
                        </View>
                    </View>
                    <View style={styles.phoneInputWrapper}>
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder={placeholder}
                            placeholderTextColor="#999"
                            value={displayValue}
                            onChangeText={handleChangeText}
                            keyboardType="phone-pad"
                            editable={!disabled}
                            autoComplete="tel"
                            accessibilityLabel="Phone number"
                        />
                    </View>
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }
);

SquaredPhoneInput.displayName = 'SquaredPhoneInput';

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    phoneRow: {
        flexDirection: 'row',
        marginLeft: 30, // Indent to align with other inputs
    },
    prefixContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 4,
        marginRight: theme.spacing.sm,
        width: 80,
        backgroundColor: '#fff',
    },
    prefixContainerError: {
        borderColor: theme.colors.error,
    },
    prefixText: {
        fontSize: 8,
        color: '#666',
        marginBottom: 2,
    },
    flagRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        width: 16,
        height: 12,
        marginRight: 4,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    countryCode: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    phoneInputWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: theme.spacing.sm,
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        color: '#000',
        fontSize: theme.fontSize.sm,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: theme.fontSize.xs,
        marginTop: theme.spacing.xs,
        marginLeft: 30 + theme.spacing.xs, // Align with input
    },
});

