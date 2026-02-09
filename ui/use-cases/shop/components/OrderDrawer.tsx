import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/ui/theme';
import { useGetCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from '@/features/cart/hooks';
import { OrderItemCard } from './OrderItemCard';
import { useCheckout } from '@/features/orders/hooks';
import { Format } from '@/libs/fmt';
import { LocationPickerModal, SelectedLocation } from './LocationPickerModal';
import { DeliveryType } from '@/features/orders/types';
import { PriceCalculationView } from './PriceCalculationView';

interface OrderDrawerProps {
    visible: boolean;
    onClose: () => void;
}

export const OrderDrawer = ({ visible, onClose }: OrderDrawerProps) => {
    const router = useRouter();
    const { items: cartItems, getCart, isLoading: isLoadingCart, data: cartData } = useGetCart();
    const { clearCart } = useClearCart({ onSuccess: () => getCart() });
    const { removeCartItem } = useRemoveCartItem({ onSuccess: () => getCart() });
    const { updateCartItem } = useUpdateCartItem({ onSuccess: () => getCart() });

    useEffect(() => {
        if (visible) {
            getCart();
        }
    }, [visible]);

    const [paymentMethod, setPaymentMethod] = useState<'after_delivery' | 'now'>('after_delivery');
    const [eliteNumber, setEliteNumber] = useState('+225 45 66 77 88 99');
    const [paymentProvider, setPaymentProvider] = useState('ORANGE_MONEY');
    const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [previousLocations, setPreviousLocations] = useState<SelectedLocation[]>([]);

    const { checkout, isLoading: isCheckingOut } = useCheckout({
        onSuccess: () => {
            clearCart();
            onClose();
            router.push('/(protected)/(client)/shops/order-success');
        }
    });

    const subtotal = useMemo(() =>
        cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
        , [cartItems]);

    // Get shop location from first cart item (assuming all items are from same shop for now)
    const shopLocation = useMemo(() => {
        const firstItem = cartItems[0];
        const shop = firstItem?.product?.shop;
        // For now, we'll use a default location if shop doesn't have coordinates
        // In a real scenario, you'd fetch shop details with coordinates
        return {
            latitude: 5.3600, // Default to Abidjan coordinates
            longitude: -4.0083,
        };
    }, [cartItems]);

    // Note: The API currently doesn't return shop data with cart items
    // So we can't group by shop. Displaying all items together for now.

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        // Validate delivery address if delivery type is 'delivery'
        if (deliveryType === 'delivery' && !selectedLocation) {
            alert('Veuillez sélectionner une adresse de livraison');
            return;
        }

        // Group cart items by shop_id
        const shopGroups = new Map<number, any>();
        cartItems.forEach(item => {
            const shopId = item.product?.shop?.id;
            if (shopId) {
                if (!shopGroups.has(shopId)) {
                    const orderItem: any = {
                        shop_id: shopId,
                        delivery_type: deliveryType,
                    };

                    // Add delivery_address only if delivery type is 'delivery'
                    if (deliveryType === 'delivery' && selectedLocation) {
                        orderItem.delivery_address = {
                            address: selectedLocation.address,
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                        };
                    }

                    shopGroups.set(shopId, orderItem);
                }
            }
        });

        const ordersArray = Array.from(shopGroups.values());

        // If no shop IDs found (API issue), create a single order with all items
        if (ordersArray.length === 0) {
            console.warn('No shop IDs found in cart items, creating single order');
            const singleOrder: any = {
                shop_id: 1, // Placeholder - this needs backend fix
                delivery_type: deliveryType,
            };

            if (deliveryType === 'delivery' && selectedLocation) {
                singleOrder.delivery_address = {
                    address: selectedLocation.address,
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                };
            }

            ordersArray.push(singleOrder);
        }

        const payload = { orders: ordersArray };
        console.log('Checkout payload:', JSON.stringify(payload, null, 2));
        checkout(payload);
    };

    const handleLocationSelect = (location: SelectedLocation) => {
        setSelectedLocation(location);
        // Add to previous locations if not already there
        if (!previousLocations.find(loc => loc.latitude === location.latitude && loc.longitude === location.longitude)) {
            setPreviousLocations(prev => [location, ...prev].slice(0, 5)); // Keep last 5
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.dismissArea} onPress={onClose} />

                {/* Side Drawer - like CartDrawer */}
                <View style={styles.drawer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>MA COMMANDE</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoadingCart && !cartData ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 40 }} />
                        </View>
                    ) : cartItems.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cart-outline" size={64} color="rgba(255,255,255,0.1)" />
                            <Text style={styles.emptyText}>Votre panier est vide</Text>
                        </View>
                    ) : (
                        <>
                            {/* Single ScrollView for entire content */}
                            <ScrollView
                                style={styles.scrollView}
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Cart Items */}
                                {cartItems.map((item) => (
                                    <OrderItemCard
                                        key={item.id}
                                        item={item}
                                        onRemove={(itemId) => removeCartItem({ id: itemId })}
                                        onQuantityChange={(itemId, quantity) => updateCartItem({ id: itemId, quantity })}
                                    />
                                ))}

                                {/* Delivery Type Selection */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Type de livraison</Text>

                                    <TouchableOpacity
                                        style={styles.paymentOption}
                                        onPress={() => setDeliveryType('delivery')}
                                    >
                                        <Ionicons
                                            name={deliveryType === 'delivery' ? 'checkbox' : 'square-outline'}
                                            size={20}
                                            color={theme.colors.accent}
                                        />
                                        <Text style={styles.paymentOptionText}>Livraison à domicile</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.paymentOption}
                                        onPress={() => setDeliveryType('pickup')}
                                    >
                                        <Ionicons
                                            name={deliveryType === 'pickup' ? 'checkbox' : 'square-outline'}
                                            size={20}
                                            color={theme.colors.accent}
                                        />
                                        <Text style={styles.paymentOptionText}>Retrait en boutique</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Location Selection - Only show for delivery */}
                                {deliveryType === 'delivery' && (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Adresse de livraison</Text>
                                        <TouchableOpacity
                                            style={styles.locationButton}
                                            onPress={() => setShowLocationPicker(true)}
                                        >
                                            <Ionicons name="location" size={20} color={theme.colors.accent} />
                                            <Text style={styles.locationButtonText}>
                                                {selectedLocation
                                                    ? selectedLocation.name
                                                    : 'Choisir une adresse'}
                                            </Text>
                                            <Ionicons name="chevron-forward" size={20} color="#999" />
                                        </TouchableOpacity>
                                        {!selectedLocation && (
                                            <Text style={styles.locationHint}>
                                                Veuillez sélectionner une adresse de livraison
                                            </Text>
                                        )}
                                    </View>
                                )}

                                {/* Price Calculation */}
                                <PriceCalculationView
                                    subtotal={subtotal}
                                    deliveryType={deliveryType}
                                    selectedLocation={selectedLocation}
                                    shopLocation={shopLocation}
                                />

                                {/* Payment Method */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Mode de paiement</Text>

                                    <TouchableOpacity
                                        style={styles.paymentOption}
                                        onPress={() => setPaymentMethod('after_delivery')}
                                    >
                                        <Ionicons
                                            name={paymentMethod === 'after_delivery' ? 'checkbox' : 'square-outline'}
                                            size={20}
                                            color={theme.colors.accent}
                                        />
                                        <Text style={styles.paymentOptionText}>Payez après la livraison</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.paymentOption}
                                        onPress={() => setPaymentMethod('now')}
                                    >
                                        <Ionicons
                                            name={paymentMethod === 'now' ? 'checkbox' : 'square-outline'}
                                            size={20}
                                            color={theme.colors.accent}
                                        />
                                        <Text style={styles.paymentOptionText}>Payez maintenant</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Elite Number */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Numéro marchand Elite</Text>
                                    <Text style={styles.merchantNumber}>{eliteNumber}</Text>
                                </View>

                                {/* Payment Provider */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Paiement</Text>
                                    <View style={styles.providerSelector}>
                                        <Text style={styles.providerText}>{paymentProvider}</Text>
                                        <Ionicons name="chevron-down" size={20} color={theme.colors.accent} />
                                    </View>
                                </View>
                            </ScrollView>

                            {/* Fixed Footer */}

                            {/* Footer */}
                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[styles.commanderButton, isCheckingOut && styles.commanderButtonDisabled]}
                                    onPress={handleCheckout}
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.commanderButtonText}>COMMANDER</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {/* Location Picker Modal */}
                    <LocationPickerModal
                        visible={showLocationPicker}
                        onClose={() => setShowLocationPicker(false)}
                        onSelectLocation={handleLocationSelect}
                        currentLocation={selectedLocation || undefined}
                        previousLocations={previousLocations}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
    },
    dismissArea: {
        flex: 1,
    },
    drawer: {
        width: '85%',
        backgroundColor: theme.colors.background,
        height: '100%',
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255, 255, 255, 0.18)',
    },
    title: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    closeBtn: {
        // padding: 4,
    },
    closeText: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 0,
    },
    bottomSection: {
        padding: 16,
        backgroundColor: theme.colors.background,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        opacity: 0.5,
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
    section: {
        marginBottom: 10,
    },
    merchantNumber: {
        fontSize: 14,
        color: theme.colors.accent,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 12,
        fontWeight: 'bold',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 10,
    },
    paymentOptionText: {
        fontSize: 14,
        color: '#fff',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: theme.colors.accent,
        fontSize: 14,
    },
    totalAmountText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
    providerSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    providerText: {
        fontSize: 14,
        color: theme.colors.accent,
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        borderTopWidth: 3,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    commanderButton: {
        backgroundColor: theme.colors.accent,
        padding: 8,
        width: "auto",
        marginHorizontal: "auto"
    },
    commanderButtonDisabled: {
        opacity: 0.6,
    },
    commanderButtonText: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        textAlign: "center",
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    locationButtonText: {
        flex: 1,
        color: '#fff',
        fontSize: theme.fontSize.md,
        marginLeft: 8,
    },
    locationHint: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.sm,
        marginTop: 8,
        fontStyle: 'italic',
    },
});
