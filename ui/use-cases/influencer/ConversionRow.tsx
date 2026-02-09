import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface ConversionRowProps {
    amount: string;
    date: string;
    status: 'success' | 'failed';
}

export const ConversionRow = ({ amount, date, status }: ConversionRowProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.amount}>{amount}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
            <View style={styles.status}>
                {status === 'success' ? (
                    <Ionicons name="checkmark-circle-outline" size={28} color="#000" />
                ) : (
                    <Ionicons name="close-circle-outline" size={28} color="#000" />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#666', // Gray background for row
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.xs,
    },
    info: {
        justifyContent: 'center',
    },
    amount: {
        color: theme.colors.primary, // Blue color for amount
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
    date: {
        color: theme.colors.textWhite,
        fontSize: 10,
    },
    status: {
        // Icon color is handled in component
    },
});
