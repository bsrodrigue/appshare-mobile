import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { CartItemResource } from '@/features/cart/types';
import { QuantitySelector } from '@/ui/use-cases/shared/components/QuantitySelector';
import { Format } from '@/libs/fmt';

interface CartItemRowProps {
    item: CartItemResource;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
}

export const CartItemRow = ({ item, onUpdateQuantity, onRemove }: CartItemRowProps) => {
    const product = item.product;
    const shop = product?.shop;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.shopInfo}>
                    <View style={styles.shopLogoContainer}>
                        {shop?.logo_url ? (
                            <Image source={{ uri: shop.logo_url }} style={styles.shopLogo} />
                        ) : (
                            <Ionicons name="storefront" size={12} color={theme.colors.accent} />
                        )}
                    </View>
                    <View>
                        <Text style={styles.shopName}>{shop?.name || 'Boutique'}</Text>
                        <Text style={styles.productType}>{product?.name} Stock limité</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                    <Text style={styles.removeText}>x</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product?.image_url }} style={styles.productImage} />
                </View>

                <View style={styles.bottomRow}>
                    <QuantitySelector
                        size="small"
                        quantity={item.quantity}
                        onIncrease={() => onUpdateQuantity(item.quantity + 1)}
                        onDecrease={() => onUpdateQuantity(item.quantity - 1)}
                    />
                    <Text style={styles.priceText}>{Format.price((product?.price || 0) * item.quantity)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shopLogoContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    shopLogo: {
        width: '100%',
        height: '100%',
    },
    shopName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    productType: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
    },
    removeButton: {
        padding: 4,
    },
    removeText: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.3)',
    },
    content: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    bottomRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.accent,
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
});
