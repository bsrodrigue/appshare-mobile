import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

interface ShopStatsBarProps {
    productsCount: number;
    satisfactionRate: number;
}

export const ShopStatsBar = ({ productsCount, satisfactionRate }: ShopStatsBarProps) => {
    return (
        <View style={styles.statsBar}>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{productsCount}</Text>
                <Text style={styles.statLabel}>PRODUITS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>24-48h</Text>
                <Text style={styles.statLabel}>LIVRAISON</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{satisfactionRate}%</Text>
                <Text style={styles.statLabel}>SATISFACTION</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.md,
        marginTop: 12,
        borderRadius: 12,
        paddingVertical: 16,
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        color: theme.colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});
