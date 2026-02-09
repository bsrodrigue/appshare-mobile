import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface DeliveryRequestCardProps {
    type: string;
    pickupLocation: string;
    deliveryLocation: string;
    distance: string;
    duration: string;
    price: string;
    onPress?: () => void;
}

export const DeliveryRequestCard = ({
    type,
    pickupLocation,
    deliveryLocation,
    distance,
    duration,
    price,
    onPress,
}: DeliveryRequestCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.content}>
                {/* Header / Type */}
                <Text style={styles.typeText}>{type}</Text>

                {/* Pickup */}
                <View style={styles.row}>
                    <Ionicons name="location-sharp" size={16} color={theme.colors.accent} style={styles.icon} />
                    <Text style={styles.locationText}>Récuperation {pickupLocation}</Text>
                </View>

                {/* Delivery */}
                <View style={styles.row}>
                    <View style={styles.spacerIcon} />
                    <Text style={styles.locationText}>Livraison {deliveryLocation}</Text>
                </View>

                {/* Meta Info */}
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{distance} - {duration}</Text>
                </View>

                {/* Price */}
                <Text style={styles.priceText}>{price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        position: 'relative',
    },
    typeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        marginRight: 8,
    },
    spacerIcon: {
        width: 16,
        marginRight: 8,
    },
    locationText: {
        fontSize: 14,
        color: '#333',
    },
    metaRow: {
        marginTop: 4,
        paddingLeft: 24, // Align with text start (icon width + margin)
    },
    metaText: {
        fontSize: 14,
        color: '#000',
    },
    priceText: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.accent, // Orange
    },
});
