import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DimensionValue, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface SelectInputProps {
    label: string;
    value?: string;
    onPress?: () => void;
    width?: DimensionValue;
    style?: ViewStyle;
}

export const SelectInput = ({ label, value, onPress, width, style }: SelectInputProps) => {
    return (
        <TouchableOpacity
            style={[styles.container, width ? { width } : { flex: 1 }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.label} numberOfLines={1}>
                {value || label}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.colors.textWhite} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.primary, // Blue background
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.sm, // Sharp corners or small radius
        marginRight: theme.spacing.xs,
    },
    label: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        marginRight: 4,
    },
});
