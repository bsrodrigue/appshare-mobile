import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface PointsCardProps {
    points: string;
    onExchangePress: () => void;
}

export const PointsCard = ({ points, onExchangePress }: PointsCardProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Ionicons name="sparkles" size={24} color={theme.colors.primary} style={styles.icon} />
                <Text style={styles.label}>Vos points{'\n'}Actuels</Text>
                <Text style={styles.points}>{points}</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={onExchangePress}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Échanger points</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#111', // Dark background
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    leftSection: {
        justifyContent: 'center',
    },
    icon: {
        marginBottom: theme.spacing.xs,
    },
    label: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.sm,
        marginBottom: theme.spacing.xs,
    },
    points: {
        color: theme.colors.textWhite,
        fontSize: 32,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.xl, // Rounded pill shape
    },
    buttonText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.sm,
    },
});
