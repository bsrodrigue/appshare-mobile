import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { theme } from '@/ui/theme';
import { Ionicons } from '@expo/vector-icons';
import { Format } from '@/libs/fmt';
import { QuantitySelector } from '@/ui/use-cases/shared/components/QuantitySelector';

type BadgeType = 'new' | 'promo' | 'popular' | 'free_delivery';

interface ProductCardProps {
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    imageUrl?: string;
    badges?: BadgeType[];
    onPress?: () => void;
    onAddToCart?: () => void;
    onRemoveFromCart?: () => void;
    isFavorite?: boolean;
    onFavoritePress?: () => void;
    cartQuantity?: number;
}

const BADGE_CONFIG: Record<BadgeType, { label: string; color: string }> = {
    new: { label: 'NOUVEAU', color: '#00bfff' },
    promo: { label: 'PROMO', color: '#FF3B30' },
    popular: { label: 'POPULAIRE', color: '#ff6b4a' },
    free_delivery: { label: 'LIVRAISON OFFERTE', color: '#4CAF50' },
};

export const ProductCard = ({
    name,
    price,
    originalPrice,
    quantity,
    imageUrl,
    badges = [],
    onPress,
    onAddToCart,
    onRemoveFromCart,
    isFavorite = false,
    onFavoritePress,
    cartQuantity = 0,
}: ProductCardProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const isOutOfStock = quantity === 0;
    const hasDiscount = originalPrice && originalPrice > price;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.mainWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                style={styles.container}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {/* Image Section */}
                <View style={styles.imageBox}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="cube-outline" size={30} color="#ccc" />
                        </View>
                    )}

                    {isOutOfStock && (
                        <View style={styles.outOfStockOverlay}>
                            <Text style={styles.outOfStockText}>RUPTURE</Text>
                        </View>
                    )}

                    {badges.length > 0 && (
                        <View style={styles.badgeOverlay}>
                            {badges.slice(0, 1).map((b) => (
                                <View key={b} style={[styles.badge, { backgroundColor: BADGE_CONFIG[b].color }]}>
                                    <Text style={styles.badgeText}>{BADGE_CONFIG[b].label}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.topRow}>
                        <Text style={styles.name} numberOfLines={2}>{name}</Text>
                        <TouchableOpacity style={styles.favBtn} onPress={onFavoritePress}>
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={18}
                                color={isFavorite ? theme.colors.accent : "#ddd"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{Format.price(price)}</Text>
                        {hasDiscount && (
                            <Text style={styles.oldPrice}>{Format.price(originalPrice)}</Text>
                        )}
                    </View>

                    <View style={styles.bottomRow}>
                        <View style={styles.stockInfo}>
                            <View style={[styles.stockIndicator, { backgroundColor: isOutOfStock ? '#FF3B30' : '#4CAF50' }]} />
                            <Text style={styles.stockText}>{isOutOfStock ? 'Indisponible' : 'En stock'}</Text>
                        </View>

                        {cartQuantity > 0 ? (
                            <QuantitySelector
                                size="small"
                                quantity={cartQuantity}
                                onIncrease={() => onAddToCart?.()}
                                onDecrease={() => onRemoveFromCart?.()}
                            />
                        ) : (
                            <TouchableOpacity
                                style={[styles.addBtn, isOutOfStock && styles.disabledBtn]}
                                onPress={onAddToCart}
                                disabled={isOutOfStock}
                            >
                                <Ionicons name="cart" size={14} color="#fff" />
                                <Text style={styles.addBtnText}>AJOUTER</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        marginBottom: 12,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    imageBox: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    badgeOverlay: {
        position: 'absolute',
        top: 4,
        left: 4,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 20,
        marginRight: 8,
    },
    favBtn: {
        padding: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
    oldPrice: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        textDecorationLine: 'line-through',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    stockInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stockIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    stockText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
    },
    addBtn: {
        backgroundColor: theme.colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    disabledBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    addBtnText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
