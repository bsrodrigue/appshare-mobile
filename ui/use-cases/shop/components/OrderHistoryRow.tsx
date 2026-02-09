import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/ui/theme';
import { OrderResource } from '@/features/orders/types';
import { Format } from '@/libs/fmt';
import { Ionicons } from '@expo/vector-icons';

interface OrderHistoryRowProps {
    order: OrderResource;
    onPress?: () => void;
}

export const OrderHistoryRow = ({ order, onPress }: OrderHistoryRowProps) => {

    // Format date to display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return '#27ae60'; // Green
            case 'cancelled':
                return '#e74c3c'; // Red
            case 'in_delivery':
                return '#3498db'; // Blue
            case 'preparing':
            case 'ready':
                return '#f39c12'; // Orange
            default:
                return theme.colors.accent;
        }
    };

    // Get delivery type label
    const deliveryTypeLabel = order.delivery_type === 'delivery' ? 'Livraison' : 'Retrait';

    // Get shop name or default
    const shopName = order.shop?.name || 'Boutique';

    // Get item count
    const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
            {/* Shop Name / Reference */}
            <View style={[styles.cell, styles.shopCell]}>
                <Text style={styles.text} numberOfLines={1}>
                    {shopName}
                </Text>
                <Text style={styles.referenceText} numberOfLines={1}>
                    #{order.reference}
                </Text>
            </View>

            {/* Delivery Type & Items */}
            {/* <View style={[styles.cell, styles.typeCell]}>
                <View style={styles.iconRow}>
                    <Ionicons
                        name={order.delivery_type === 'delivery' ? 'bicycle' : 'bag-handle'}
                        size={12}
                        color={theme.colors.textWhite}
                    />
                    <Text style={styles.smallText} numberOfLines={1}>
                        {deliveryTypeLabel}
                    </Text>
                </View>
                <Text style={styles.smallText}>
                    {itemCount} article{itemCount > 1 ? 's' : ''}
                </Text>
            </View> */}

            {/* Price */}
            <View style={[styles.cell, styles.priceCell]}>
                <Text style={styles.text}>{Format.price(order.total)}</Text>
            </View>

            {/* Status */}
            <View style={[styles.cell, styles.statusCell, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText} numberOfLines={2}>
                    {order.status_label}
                </Text>
            </View>

            {/* Date */}
            <View style={[styles.cell, styles.dateCell]}>
                <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xs,
        minHeight: 50,
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginRight: 2,
    },
    shopCell: {
        flex: 3,
        backgroundColor: theme.colors.accent,
        alignItems: 'flex-start',
    },
    typeCell: {
        flex: 2,
        backgroundColor: '#3498db',
    },
    priceCell: {
        flex: 1.5,
        backgroundColor: theme.colors.accent,
    },
    statusCell: {
        flex: 2,
    },
    dateCell: {
        flex: 1.8,
        backgroundColor: theme.colors.textWhite,
        marginRight: 0,
    },
    text: {
        color: theme.colors.textWhite,
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    smallText: {
        color: theme.colors.textWhite,
        fontSize: 9,
        fontWeight: '600',
        textAlign: 'center',
    },
    referenceText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 8,
        marginTop: 2,
    },
    statusText: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dateText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },
});
