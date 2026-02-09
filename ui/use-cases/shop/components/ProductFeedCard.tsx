import React, { useState } from 'react';
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
import { ProductResource } from '@/features/products/types';
import { QuantityControls } from './QuantityControls';

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
const IMAGE_WIDTH = width - (CARD_PADDING * 2);

interface ProductFeedCardProps {
    product: ProductResource;
    quantity: number;
    onQuantityChange: (productId: number, delta: number) => void;
    onOrder: (product: ProductResource) => void;
}

export const ProductFeedCard = ({
    product,
    quantity,
    onQuantityChange,
    onOrder,
}: ProductFeedCardProps) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20) + 1);
    const [commentCount] = useState(Math.floor(Math.random() * 30) + 5);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' CFA';
    };

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
                <TouchableOpacity style={styles.menuButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={20} color="#999" />
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
                {/* Price */}
                <Text style={styles.price}>{formatPrice(product.price)}</Text>

                {/* Like */}
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <Ionicons
                        name={liked ? "heart" : "heart-outline"}
                        size={18}
                        color={liked ? "#FF6B6B" : "#666"}
                    />
                    <Text style={styles.actionCount}>{likeCount}</Text>
                </TouchableOpacity>

                {/* Comments */}
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.actionCount}>{commentCount}</Text>
                </TouchableOpacity>

                <QuantityControls
                    quantity={quantity}
                    onIncrease={() => onQuantityChange(product.id, 1)}
                    onDecrease={() => onQuantityChange(product.id, -1)}
                />

                {/* Commander Button */}
                <TouchableOpacity
                    style={styles.commanderButton}
                    onPress={() => onOrder(product)}
                >
                    <Text style={styles.commanderText}>COMMANDER</Text>
                </TouchableOpacity>

                {/* Share */}
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons name="share-outline" size={18} color="#666" />
                </TouchableOpacity>
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
        height: IMAGE_WIDTH * 0.6,
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
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingVertical: 10,
        gap: 1,
        backgroundColor: '#fff',
    },
    price: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    actionCount: {
        fontSize: 11,
        color: '#666',
    },
    commanderButton: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 3,
    },
    commanderText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
});
