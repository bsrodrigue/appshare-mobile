import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { ProductFeedCard } from '@/ui/use-cases/shop/components/ProductFeedCard';
import { CategoryTabs } from '@/ui/use-cases/shop/components/CategoryTabs';
import { OrderDrawer } from '@/ui/use-cases/shop/components/OrderDrawer';
import { FiltersModal } from '@/ui/use-cases/shop/components/FiltersModal';
import { DebouncedTextInput } from '@/ui/use-cases/shared/components/inputs/DebouncedTextInput';
import { useSearchProducts } from '@/features/products/hooks';
import { ProductResource } from '@/features/products/types';
import { useGetCart, useAddToCart, useUpdateCartItem, useRemoveCartItem } from '@/features/cart/hooks';
import { useGetProductCategories } from '@/features/product-categories/hooks';

export function ShopTabScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isOrderDrawerVisible, setIsOrderDrawerVisible] = useState(false);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);

    const { products, pagination, isLoading, searchProducts } = useSearchProducts({
        onError: (error) => console.error('Failed to fetch products:', error),
    });

    const { categories, getProductCategories } = useGetProductCategories();

    const { items: cartItems, getCart } = useGetCart();
    const { addToCart } = useAddToCart({ onSuccess: () => getCart() });
    const { updateCartItem } = useUpdateCartItem({ onSuccess: () => getCart() });
    const { removeCartItem } = useRemoveCartItem({ onSuccess: () => getCart() });

    // Create a map of product quantities from cart
    const productQuantities = useMemo(() => {
        const map = new Map<number, number>();
        cartItems.forEach(item => {
            if (item.product_id) {
                const existing = map.get(item.product_id) || 0;
                map.set(item.product_id, existing + item.quantity);
            }
        });
        return map;
    }, [cartItems]);

    // Initial load
    useEffect(() => {
        loadProducts();
        getCart();
        getProductCategories();
    }, []);

    // Search when query changes
    useEffect(() => {
        if (searchQuery !== undefined) {
            loadProducts();
        }
    }, [searchQuery, activeCategory]);

    const loadProducts = async () => {
        const params = searchQuery.trim() ? { search: searchQuery, category_id: activeCategory } : { category_id: activeCategory };
        await searchProducts(params);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    };

    const handleQuantityChange = (productId: number, delta: number) => {
        const cartItem = cartItems.find(item => item.product_id === productId);

        if (!cartItem && delta > 0) {
            // Add new item to cart
            addToCart({ product_id: productId, quantity: 1 });
        } else if (cartItem) {
            const newQty = cartItem.quantity + delta;
            if (newQty > 0) {
                updateCartItem({ id: cartItem.id, quantity: newQty });
            } else {
                removeCartItem({ id: cartItem.id });
            }
        }
    };

    const handleOrder = (product: ProductResource) => {
        // Ensure product is in cart before opening drawer
        const cartItem = cartItems.find(item => item.product_id === product.id);
        if (!cartItem) {
            addToCart({ product_id: product.id, quantity: 1 });
        }
        setIsOrderDrawerVisible(true);
    };

    const renderHeader = () => (
        <View style={styles.headerStack}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <DebouncedTextInput
                        style={styles.searchInput}
                        placeholder="Catégorie ou Centre d'interet"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => setIsFiltersVisible(true)}
                    >
                        <MaterialCommunityIcons name="filter-variant" size={15} color={theme.colors.background} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Category Tabs */}
            <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategory}
            />
        </View>
    );

    const renderProductItem = ({ item }: { item: ProductResource }) => {
        const quantity = productQuantities.get(item.id) || 0;

        return (
            <ProductFeedCard
                product={item}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                onOrder={handleOrder}
            />
        );
    };

    const renderEmptyState = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.accent} />
                    <Text style={styles.loadingText}>Chargement des produits...</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
        );
    };

    return (
        <>
            <View style={styles.content}>
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProductItem}
                    ListHeaderComponent={renderHeader}
                    stickyHeaderIndices={[0]}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.colors.accent}
                        />
                    }
                    ListEmptyComponent={renderEmptyState}
                />
            </View>

            <OrderDrawer
                visible={isOrderDrawerVisible}
                onClose={() => setIsOrderDrawerVisible(false)}
            />

            <FiltersModal
                visible={isFiltersVisible}
                onClose={() => setIsFiltersVisible(false)}
                onApply={(filters) => {
                    console.log('Filters applied:', filters);
                    setIsFiltersVisible(false);
                }}
            />

            {cartItems.length > 0 && !isOrderDrawerVisible && (
                <TouchableOpacity
                    style={styles.floatingCart}
                    onPress={() => setIsOrderDrawerVisible(true)}
                >
                    <Ionicons name="cart" size={28} color="#fff" />
                    <View style={styles.cartCount}>
                        <Text style={styles.cartCountText}>{cartItems.length}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerStack: {
        backgroundColor: theme.colors.background,
        paddingBottom: 14,
    },
    searchContainer: {
        paddingTop: 12,
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.whiteBackground,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchInput: {
        flex: 1,
        fontSize: 12,
        color: theme.colors.text,
        paddingLeft: 8,
    },
    filterBtn: {
        paddingHorizontal: 12,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
    },
    listContent: {
        paddingBottom: 100,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    loadingText: {
        color: '#999',
        fontSize: 14,
        marginTop: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
        marginTop: 12,
    },
    floatingCart: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: theme.colors.accent,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    cartCount: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#fff',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartCountText: {
        color: theme.colors.accent,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
