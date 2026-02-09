import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface ShopTrustSectionProps {
    responseTime: string;
    satisfactionRate: number;
}

export const ShopTrustSection = ({ responseTime, satisfactionRate }: ShopTrustSectionProps) => {
    return (
        <View style={styles.trustSection}>
            <View style={styles.trustItem}>
                <Ionicons name="shield-checkmark" size={20} color="#00C853" />
                <Text style={styles.trustText}>Boutique Verifiée</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.trustText}>Repond en {responseTime}</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
                <Ionicons name="thumbs-up" size={20} color={theme.colors.accent} />
                <Text style={styles.trustText}>{satisfactionRate}% satisfaits</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    trustSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 2,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    trustItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        justifyContent: 'center',
    },
    trustDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    trustText: {
        fontSize: 11,
        color: theme.colors.textLight,
        fontWeight: '500',
    },
});
