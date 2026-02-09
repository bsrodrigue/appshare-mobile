import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '@/ui/theme';
import { Format } from '@/libs/fmt';
import { useCalculateDeliveryFees } from '@/features/orders/hooks';
import { SelectedLocation } from './LocationPickerModal';

interface PriceCalculationViewProps {
    subtotal: number;
    deliveryType: 'delivery' | 'pickup';
    selectedLocation: SelectedLocation | null;
    shopLocation?: {
        latitude: number;
        longitude: number;
    };
}

export const PriceCalculationView = ({
    subtotal,
    deliveryType,
    selectedLocation,
    shopLocation,
}: PriceCalculationViewProps) => {
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [feeBreakdown, setFeeBreakdown] = useState<{
        base_fee: number;
        distance_fee: number;
        distance_km: number;
    } | null>(null);

    const { calculateDeliveryFees, isLoading } = useCalculateDeliveryFees({
        onSuccess: (response) => {
            setDeliveryFee(response.data.fee);
            setFeeBreakdown({
                base_fee: response.data.breakdown.base_fee,
                distance_fee: response.data.breakdown.distance_fee,
                distance_km: response.data.distance_km,
            });
        },
        onError: (error) => {
            console.error('Error calculating delivery fees:', error);
            setDeliveryFee(0);
            setFeeBreakdown(null);
        },
    });

    useEffect(() => {
        // Reset delivery fee if pickup is selected
        if (deliveryType === 'pickup') {
            setDeliveryFee(0);
            setFeeBreakdown(null);
            return;
        }

        // Calculate delivery fee if delivery is selected and location is available
        if (deliveryType === 'delivery' && selectedLocation && shopLocation) {
            calculateDeliveryFees({
                origin_latitude: shopLocation.latitude,
                origin_longitude: shopLocation.longitude,
                destination_latitude: selectedLocation.latitude,
                destination_longitude: selectedLocation.longitude,
                type: 'order',
            });
        } else {
            // Reset if no location selected
            setDeliveryFee(0);
            setFeeBreakdown(null);
        }
    }, [deliveryType, selectedLocation, shopLocation]);

    const total = subtotal + deliveryFee;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Récapitulatif</Text>

            {/* Subtotal */}
            <View style={styles.row}>
                <Text style={styles.label}>Sous-total</Text>
                <Text style={styles.value}>{Format.price(subtotal)}</Text>
            </View>

            {/* Delivery Fee */}
            <View style={styles.row}>
                <Text style={styles.label}>Frais de livraison</Text>
                {isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.accent} />
                ) : (
                    <Text style={styles.value}>
                        {deliveryType === 'pickup' ? 'Gratuit' : Format.price(deliveryFee)}
                    </Text>
                )}
            </View>

            {/* Breakdown (if available) */}
            {feeBreakdown && deliveryType === 'delivery' && (
                <View style={styles.breakdown}>
                    <Text style={styles.breakdownText}>
                        Distance: {feeBreakdown.distance_km.toFixed(2)} km
                    </Text>
                    <Text style={styles.breakdownText}>
                        Frais de base: {Format.price(feeBreakdown.base_fee)}
                    </Text>
                    <Text style={styles.breakdownText}>
                        Frais de distance: {Format.price(feeBreakdown.distance_fee)}
                    </Text>
                </View>
            )}

            {/* Total */}
            <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>{Format.price(total)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingVertical: 16,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionTitle: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 12,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    value: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    breakdown: {
        marginLeft: 16,
        marginTop: 4,
        marginBottom: 12,
    },
    breakdownText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 2,
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
});
