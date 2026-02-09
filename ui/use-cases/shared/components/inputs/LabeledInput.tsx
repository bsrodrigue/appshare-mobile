import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { theme } from '@/ui/theme';

interface LabeledInputProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

export const LabeledInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default'
}: LabeledInputProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.placeholder} // Or gray if placeholder is needed
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        color: theme.colors.accent, // Orange color for label
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    input: {
        backgroundColor: theme.colors.textWhite,
        borderRadius: theme.borderRadius.xs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 8,
        fontSize: theme.fontSize.base,
        color: '#000',
    },
});
