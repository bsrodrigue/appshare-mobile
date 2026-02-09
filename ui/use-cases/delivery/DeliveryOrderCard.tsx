import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface DeliveryOrderCardProps {
    type: 'colis' | 'Shop';
    pickupLocation: string;
    deliveryLocation: string;
    distance: string;
    duration: string;
    price: string;
    onDetailPress?: () => void;
}

export const DeliveryOrderCard = ({
    type,
    pickupLocation,
    deliveryLocation,
    distance,
    duration,
    price,
    onDetailPress
}: DeliveryOrderCardProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.type}>{type}</Text>
                <TouchableOpacity onPress={onDetailPress} style={styles.detailButton}>
                    <Text style={styles.detailText}>DÉTAIL</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={theme.colors.accent} />
                <Text style={styles.locationText}>{pickupLocation}</Text>
            </View>

            <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={theme.colors.primary} />
                <Text style={styles.locationText}>{deliveryLocation}</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.metaInfo}>{distance} - {duration}</Text>
                <Text style={styles.price}>{price}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.textWhite, // White background as per design
        borderRadius: theme.borderRadius.xs,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    type: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: '#000',
    },
    detailButton: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
    },
    detailText: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: 'bold',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    locationText: {
        marginLeft: theme.spacing.sm,
        color: '#000',
        fontSize: theme.fontSize.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: theme.spacing.sm,
    },
    metaInfo: {
        color: '#000',
        fontSize: theme.fontSize.sm,
    },
    price: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
});
