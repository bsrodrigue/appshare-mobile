import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface EditableFieldProps {
    label: string;
    value?: string;
    onPress?: () => void;
    icon?: string;
}

export const EditableField = ({ label, value, onPress }: EditableFieldProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.label}>{value || label}</Text>
            <FontAwesome name="pencil-square-o" size={16} color={theme.colors.textWhite} />
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
    },
});
