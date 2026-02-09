import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { ProductCard } from '@/ui/use-cases/shop/components/ProductCard';
import { ProductResource } from '@/features/products/types';
import { CartItemResource } from '@/features/cart/types';

interface SortOption {
    value: string;
    label: string;
    icon: string;
}

interface ShopProductsSectionProps {
    products: ProductResource[];
    productsLoading: boolean;
    cartItems: CartItemResource[];
    selectedCategory: string | null;
    categories: string[];
    sortBy: string;
    sortOptions: SortOption[];
    showSortModal: boolean;
    favorites: Set<number>;
    onCategorySelect: (category: string | null) => void;
    onSortToggle: () => void;
    onSortSelect: (value: any) => void;
    onProductPress: (productId: number) => void;
    onAddToCart: (productId: number) => void;
    onRemoveFromCart?: (productId: number) => void;
    onFavoritePress: (productId: number) => void;
}

export const ShopProductsSection = ({
    products,
    productsLoading,
    cartItems,
    selectedCategory,
    categories,
    sortBy,
    sortOptions,
    showSortModal,
    favorites,
    onCategorySelect,
    onSortToggle,
    onSortSelect,
    onProductPress,
    onAddToCart,
    onRemoveFromCart,
    onFavoritePress,
}: ShopProductsSectionProps) => {

    const getProductCartQty = (productId: number) => {
        const item = cartItems.find(i => i.product_id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <View style={styles.productsSection}>
            <View style={styles.productsHeader}>
                <Text style={styles.sectionTitle}>Produits ({products.length})</Text>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={onSortToggle}
                >
                    <Ionicons name="funnel-outline" size={18} color={theme.colors.textWhite} />
                    <Text style={styles.sortButtonText}>Trier</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryChip,
                            (selectedCategory === category || (index === 0 && !selectedCategory)) && styles.categoryChipActive,
                        ]}
                        onPress={() => onCategorySelect(index === 0 ? null : category)}
                    >
                        <Text
                            style={[
                                styles.categoryChipText,
                                (selectedCategory === category || (index === 0 && !selectedCategory)) && styles.categoryChipTextActive,
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {showSortModal && (
                <View style={styles.sortModal}>
                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.sortOption, sortBy === option.value && styles.sortOptionActive]}
                            onPress={() => onSortSelect(option.value)}
                        >
                            <Ionicons
                                name={option.icon as any}
                                size={18}
                                color={sortBy === option.value ? theme.colors.primary : theme.colors.textLight}
                            />
                            <Text style={[styles.sortOptionText, sortBy === option.value && styles.sortOptionTextActive]}>
                                {option.label}
                            </Text>
                            {sortBy === option.value && (
                                <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {productsLoading ? (
                <View style={styles.productsLoading}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text style={styles.productsLoadingText}>Chargement des produits...</Text>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.emptyProducts}>
                    <Ionicons name="cube-outline" size={48} color={theme.colors.textLight} />
                    <Text style={styles.emptyProductsText}>Aucun produit disponible</Text>
                </View>
            ) : (
                <View style={styles.productsList}>
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            name={product.name}
                            price={product.price}
                            originalPrice={index % 4 === 0 ? Math.round(product.price * 1.25) : undefined}
                            quantity={product.quantity}
                            imageUrl={product.image_url}
                            badges={index % 3 === 0 ? ['new'] : index % 5 === 0 ? ['promo'] : []}
                            isFavorite={favorites.has(product.id)}
                            cartQuantity={getProductCartQty(product.id)}
                            onPress={() => onProductPress(product.id)}
                            onAddToCart={() => onAddToCart(product.id)}
                            onRemoveFromCart={() => onRemoveFromCart?.(product.id)}
                            onFavoritePress={() => onFavoritePress(product.id)}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    productsSection: {
        padding: 16,
    },
    productsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    sortButtonText: {
        color: theme.colors.textWhite,
        fontSize: 12,
        fontWeight: '500',
    },
    categoriesScroll: {
        marginBottom: 16,
        marginLeft: -16,
        paddingLeft: 16,
    },
    categoriesContent: {
        gap: 8,
        paddingRight: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
    categoryChipActive: {
        backgroundColor: theme.colors.accent,
    },
    categoryChipText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
    },
    categoryChipTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sortModal: {
        backgroundColor: '#25293e',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    sortOptionActive: {
        backgroundColor: 'rgba(0,191,255,0.1)',
    },
    sortOptionText: {
        flex: 1,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    sortOptionTextActive: {
        color: theme.colors.accent,
        fontWeight: '600',
    },
    productsLoading: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    productsLoadingText: {
        marginTop: 12,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    },
    emptyProducts: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyProductsText: {
        marginTop: 12,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
    },
    productsList: {
        gap: 4,
    },
});
