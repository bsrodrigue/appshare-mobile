import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface OrderItemProps {
    name: string;
    quantity: string;
    date: string;
    onWhatsAppPress?: () => void;
}

export const OrderItem = ({ name, quantity, date, onWhatsAppPress }: OrderItemProps) => {
    return (
        <View style={styles.container}>
            {/* Product Name */}
            <View style={styles.nameContainer}>
                <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
            </View>

            {/* Quantity */}
            <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{quantity}</Text>
            </View>

            {/* Date */}
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{date}</Text>
            </View>

            {/* WhatsApp Action */}
            <TouchableOpacity
                style={styles.actionContainer}
                onPress={onWhatsAppPress}
                activeOpacity={0.8}
            >
                <FontAwesome name="whatsapp" size={24} color={theme.colors.accent} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        height: 45,
    },
    nameContainer: {
        flex: 2,
        backgroundColor: theme.colors.accent,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.sm,
        marginRight: 4,
    },
    nameText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.base,
    },
    quantityContainer: {
        width: 40,
        backgroundColor: theme.colors.textWhite,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    quantityText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: theme.fontSize.lg,
    },
    dateContainer: {
        flex: 1.5,
        backgroundColor: theme.colors.textWhite,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    dateText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: theme.fontSize.sm,
    },
    actionContainer: {
        width: 45,
        backgroundColor: theme.colors.textWhite,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
