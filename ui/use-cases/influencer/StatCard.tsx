import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface StatCardProps {
    iconName: string;
    iconType: 'FontAwesome5' | 'Ionicons';
    label: string;
    value: string;
    backgroundColor?: string;
}

export const StatCard = ({ iconName, iconType, label, value, backgroundColor }: StatCardProps) => {
    return (
        <View style={[styles.container, backgroundColor ? { backgroundColor } : undefined]}>
            <View style={styles.iconContainer}>
                {iconType === 'FontAwesome5' ? (
                    <FontAwesome5 name={iconName} size={24} color={theme.colors.primary} />
                ) : (
                    <Ionicons name={iconName as any} size={24} color={theme.colors.primary} />
                )}
            </View>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.cardBackground, // Use theme card background by default
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        width: '48%', // Fit two in a row
        minHeight: 140,
        justifyContent: 'center',
        // Add shadow/elevation if needed, but design looks flat/dark
    },
    iconContainer: {
        marginBottom: theme.spacing.sm,
    },
    label: {
        color: theme.colors.textWhite,
        fontSize: 12,
        marginBottom: theme.spacing.xs,
    },
    value: {
        color: theme.colors.textWhite,
        fontSize: 32,
        fontWeight: 'bold',
    },
});
