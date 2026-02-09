import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface DropdownFieldProps {
    label: string;
    value?: string;
    onPress?: () => void;
    labelColor?: string;
}

export const DropdownField = ({ label, value, onPress, labelColor }: DropdownFieldProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.label, labelColor ? { color: labelColor } : undefined]}>
                {value || label}
            </Text>
            <FontAwesome name="caret-down" size={16} color={theme.colors.textWhite} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#555', // Dark gray background
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 10,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.sm,
    },
    label: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
