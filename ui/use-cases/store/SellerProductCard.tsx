import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, typography } from '@/ui/theme';
import { SectionHeader } from '@/ui/use-cases/shared/components/SectionHeader';
import { SellerProductResource } from '@/features/products/types';
import { SellerShopResource } from '@/features/shops/types';

interface SellerProductCardProps {
    product: SellerProductResource;
    shop: SellerShopResource | null;
    onMenuPress?: () => void;
    onViewOrdersPress?: () => void;
}

export const SellerProductCard = ({
    product,
    shop,
    onMenuPress,
    onViewOrdersPress
}: SellerProductCardProps) => {

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Découvrez cet article: ${product.name} chez ${shop?.name || 'notre boutique'}!`,
                url: product.image_url,
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <SectionHeader
                title={shop?.name || "BOUTIQUE"}
                avatarUrl={shop?.logo_url}
                onMenuPress={onMenuPress}
            />

            {/* Content */}
            <View style={styles.contentContainer}>
                <Text style={styles.description}>
                    {product.name} {product.description ? `- ${product.description}` : ''}
                </Text>

                {/* Main Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image_url }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Interaction & Stats Footer */}
                <View style={styles.footer}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="heart-outline" size={24} color={theme.colors.disabled} />
                            <Text style={styles.statText}>80</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="chatbubble-outline" size={22} color={theme.colors.disabled} />
                            <Text style={styles.statText}>15</Text>
                        </View>
                    </View>

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.viewOrdersButton}
                            onPress={onViewOrdersPress}
                        >
                            <Text style={styles.viewOrdersText}>VOIR COMMANDE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                            <Ionicons name="share-outline" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    contentContainer: {
        marginTop: 4,
    },
    description: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        lineHeight: 20,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: theme.colors.inputBackground,
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    viewOrdersButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    viewOrdersText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    shareButton: {
        padding: 4,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 4,
    },
});
