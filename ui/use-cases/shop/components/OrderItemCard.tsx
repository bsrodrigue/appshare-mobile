import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { CartItemResource } from '@/features/cart/types';
import { Format } from '@/libs/fmt';
import { QuantityControls } from './QuantityControls';

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
const IMAGE_WIDTH = width - (CARD_PADDING * 2);

interface OrderItemCardProps {
    item: CartItemResource;
    onRemove: (itemId: number) => void;
    onQuantityChange: (itemId: number, quantity: number) => void;
}

export const OrderItemCard = ({ item, onRemove, onQuantityChange }: OrderItemCardProps) => {
    const product = item.product;
    if (!product) return null;

    const totalPrice = product.price * item.quantity;
    const shopName = product.shop?.name || 'Boutique';
    const shopLogo = product.shop?.logo_url;

    return (
        <View style={styles.card}>
            {/* Shop Header */}
            <View style={styles.shopHeader}>
                <View style={styles.shopInfo}>
                    <View style={styles.shopLogo}>
                        {shopLogo ? (
                            <Image source={{ uri: shopLogo }} style={styles.logoImage} />
                        ) : (
                            <Ionicons name="storefront" size={18} color="#666" />
                        )}
                    </View>
                    <View style={styles.shopDetails}>
                        <Text style={styles.shopName}>{shopName}</Text>
                        <Text style={styles.productName}>{`${product.name} (Stock: ${product.quantity})`}</Text>
                        <Text style={styles.productDescription} numberOfLines={1}>
                            {product.description || `Stock limité`}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={() => onRemove(item.id)}>
                    <MaterialCommunityIcons name="close" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            {/* Product Images - Grid Layout like screenshot */}
            <View style={styles.imagesGrid}>
                <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
                {/* Placeholder for second image when API supports multiple */}
                <View style={styles.imageCountBadge}>
                    <Text style={styles.imageCountText}>1</Text>
                </View>
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.actionBar}>
                <QuantityControls
                    quantity={item.quantity}
                    onIncrease={() => onQuantityChange(item.id, item.quantity + 1)}
                    onDecrease={() => onQuantityChange(item.id, item.quantity - 1)}
                />

                {/* Price */}
                <Text style={styles.price}>{Format.price(totalPrice)}</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 0,
    },
    shopHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    shopLogo: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    shopDetails: {
        flex: 1,
    },
    shopName: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#000',
        opacity: 0.5,
        marginBottom: 2,
    },
    productName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2,
    },
    productDescription: {
        fontSize: 11,
        color: '#666',
    },
    menuButton: {
        padding: 4,
    },
    imagesGrid: {
        width: '100%',
        height: IMAGE_WIDTH * 0.4,
        backgroundColor: '#f8f8f8',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imageCountBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    imageCountText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },

    price: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
});
