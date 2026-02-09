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
import { ShopResource } from '@/features/shops/types';

interface ShopCardProps {
    shop: ShopResource;
    onPress?: () => void;
}

export const ShopCard = ({
    shop,
    onPress,
}: ShopCardProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const sellerName = shop.seller ? `${shop.seller.first_name} ${shop.seller.last_name}` : null;

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
                {/* Logo Section */}
                <View style={styles.logoBox}>
                    {shop.logo_url ? (
                        <Image source={{ uri: shop.logo_url }} style={styles.logo} resizeMode="cover" />
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="storefront" size={24} color={theme.colors.accent} />
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.topRow}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                            {shop.town && (
                                <View style={styles.townBadge}>
                                    <Text style={styles.townText}>{shop.town.name}</Text>
                                </View>
                            )}
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
                    </View>

                    {sellerName && (
                        <Text style={styles.sellerName} numberOfLines={1}>
                            Par {sellerName}
                        </Text>
                    )}

                    <Text style={styles.description} numberOfLines={2}>
                        {shop.description || "Découvrez nos produits d'exception et profitez de nos offres exclusives."}
                    </Text>

                    <View style={styles.bottomRow}>
                        <View style={styles.featureRow}>
                            <Ionicons name="shield-checkmark" size={12} color="#4CAF50" />
                            <Text style={styles.featureText}>Vérifié</Text>
                        </View>
                        <TouchableOpacity style={styles.visitBtn} onPress={onPress}>
                            <Text style={styles.visitBtnText}>VISITER</Text>
                        </TouchableOpacity>
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
    logoBox: {
        width: 70,
        height: 70,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    shopName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        flexShrink: 1,
    },
    townBadge: {
        backgroundColor: 'rgba(0,191,255,0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    townText: {
        fontSize: 9,
        color: theme.colors.accent,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    sellerName: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 16,
        marginBottom: 10,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: '600',
    },
    visitBtn: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    visitBtnText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
