import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { ShopResource } from '@/features/shops/types';

interface ShopHeroSectionProps {
    shop: ShopResource;
    shopRating: number;
    reviewCount: number;
    isVerified: boolean;
    renderStars: (rating: number) => React.ReactNode;
}

export const ShopHeroSection = ({
    shop,
    shopRating,
    reviewCount,
    isVerified,
    renderStars
}: ShopHeroSectionProps) => {
    return (
        <View style={styles.heroSection}>
            <View style={styles.heroContent}>
                <View style={styles.logoWrapper}>
                    <View style={styles.logoContainer}>
                        {shop.logo_url ? (
                            <Image source={{ uri: shop.logo_url }} style={styles.logo} resizeMode="cover" />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Ionicons name="storefront" size={48} color={theme.colors.accent} />
                            </View>
                        )}
                    </View>
                    {isVerified && (
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={24} color="#00C853" />
                        </View>
                    )}
                </View>
                <View style={styles.heroInfo}>
                    <Text style={styles.shopName}>{shop.name}</Text>
                    {shop.town && (
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
                            <Text style={styles.shopLocation}>{shop.town.name}</Text>
                        </View>
                    )}
                    <View style={styles.ratingRow}>
                        <View style={styles.starsContainer}>
                            {renderStars(shopRating)}
                        </View>
                        <Text style={styles.ratingText}>{shopRating}</Text>
                        <Text style={styles.reviewCountText}>({reviewCount} avis)</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heroSection: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    logoWrapper: {
        position: 'relative',
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        padding: 4,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    logoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
    },
    heroInfo: {
        flex: 1,
        marginLeft: theme.spacing.md,
        paddingTop: 4,
    },
    shopName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    shopLocation: {
        fontSize: theme.fontSize.base,
        color: theme.colors.primary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
    },
    reviewCountText: {
        fontSize: 13,
        color: theme.colors.textLight,
    },
});
