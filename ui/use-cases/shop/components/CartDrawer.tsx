import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '@/ui/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/features/cart/hooks';
import { useCheckout } from '@/features/orders/hooks';
import { CartItemRow } from './CartItemRow';
import { Format } from '@/libs/fmt';
import { useRouter } from 'expo-router';
import { DebouncedTextInput } from '@/ui/use-cases/shared/components/inputs/DebouncedTextInput';

interface CartDrawerProps {
    visible: boolean;
    onClose: () => void;
    shopId?: number;
}

export const CartDrawer = ({ visible, onClose, shopId }: CartDrawerProps) => {
    const router = useRouter();
    const { items: cartItems, getCart, isLoading: isLoadingCart, data: cartData } = useGetCart();
    const { updateCartItem } = useUpdateCartItem({ onSuccess: () => getCart() });
    const { removeCartItem } = useRemoveCartItem({ onSuccess: () => getCart() });
    const { clearCart } = useClearCart({ onSuccess: () => getCart() });

    useEffect(() => {
        if (visible) {
            getCart();
        }
    }, [visible]);

    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
    const [paymentMethod, setPaymentMethod] = useState('MOBILE_MONEY');
    const [address, setAddress] = useState('');

    const { checkout, isLoading: isCheckingOut } = useCheckout({
        onSuccess: () => {
            clearCart();
            onClose();
            router.push('/(protected)/(client)/order-success');
        }
    });

    const total = useMemo(() =>
        cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
        , [cartItems]);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        console.log('[CartDrawer] Props shopId:', shopId);
        if (cartItems[0]) {
            console.log('[CartDrawer] First Item Keys:', Object.keys(cartItems[0]));
            if (cartItems[0].product) {
                console.log('[CartDrawer] Product Keys:', Object.keys(cartItems[0].product));
                console.log('[CartDrawer] Product Shop:', cartItems[0].product.shop);
            }
        }

        // Group by shop
        const shopGroups = new Map<number, any>();
        cartItems.forEach(item => {
            // Try to find shop ID in various possible locations
            const sid = item.product?.shop?.id || (item.product as any)?.shop_id || (item as any)?.shop_id || shopId;

            if (sid) {
                const sidNum = typeof sid === 'string' ? parseInt(sid, 10) : sid;
                const type = deliveryType === 'pickup' ? 'pickup' : 'delivery';

                const orderData: any = {
                    shop_id: sidNum,
                    delivery_type: type,
                };

                if (type === 'delivery') {
                    if (!address.trim()) {
                        alert('Veuillez renseigner une adresse de livraison');
                        return;
                    }
                    orderData.delivery_address = {
                        address: address,
                        latitude: 5.3484, // Default Abidjan coords for demo
                        longitude: -4.0305
                    };
                }

                shopGroups.set(sidNum, orderData);
            }
        });

        const ordersArray = Array.from(shopGroups.values());
        if (ordersArray.length === 0) {
            console.error('No valid shops found in cart items. Items:', cartItems);
            // If all else fails and we are in a shop context, try to use it
            if (shopId && cartItems.length > 0) {
                ordersArray.push({
                    shop_id: shopId,
                    delivery_type: deliveryType,
                });
            } else {
                return;
            }
        }

        const payload = {
            orders: ordersArray
        };
        console.log('[CartDrawer] Final Checkout Payload:', JSON.stringify(payload, null, 2));
        checkout(payload);
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

                <View style={styles.drawer}>
                    <View style={styles.header}>
                        <View style={styles.headerTitleRow}>
                            <Ionicons name="cart-outline" size={24} color={theme.colors.accent} />
                            <Text style={styles.title}>MA COMMANDE</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {isLoadingCart && !cartData ? (
                            <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 40 }} />
                        ) : cartItems.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="cart-off" size={64} color="rgba(255,255,255,0.1)" />
                                <Text style={styles.emptyText}>Votre panier est vide</Text>
                                <TouchableOpacity style={styles.shopBtn} onPress={onClose}>
                                    <Text style={styles.shopBtnText}>Continuer mes achats</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View style={styles.itemsHeader}>
                                    <Text style={styles.itemsCount}>{cartItems.length} article(s)</Text>
                                    <TouchableOpacity
                                        style={styles.clearCartBtn}
                                        onPress={() => clearCart()}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="trash-outline" size={14} color={theme.colors.error} />
                                        <Text style={styles.clearCartText}>Vider le panier</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.itemsSection}>
                                    {cartItems.map((item) => (
                                        <CartItemRow
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={(q) => updateCartItem({ id: item.id, quantity: q })}
                                            onRemove={() => removeCartItem({ id: item.id })}
                                        />
                                    ))}
                                </View>

                                <View style={styles.totalContainer}>
                                    <Text style={styles.totalLabel}>TOTAL</Text>
                                    <Text style={styles.totalValue}>{Format.price(total)}</Text>
                                </View>

                                {/* Delivery Options */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Option de réception</Text>
                                    <View style={styles.optionsGrid}>
                                        <TouchableOpacity
                                            style={[styles.optionCard, deliveryType === 'delivery' && styles.optionCardActive]}
                                            onPress={() => setDeliveryType('delivery')}
                                        >
                                            <Ionicons
                                                name="bicycle"
                                                size={24}
                                                color={deliveryType === 'delivery' ? theme.colors.accent : '#666'}
                                            />
                                            <Text style={[styles.optionCardText, deliveryType === 'delivery' && styles.optionCardTextActive]}>Livraison</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.optionCard, deliveryType === 'pickup' && styles.optionCardActive]}
                                            onPress={() => setDeliveryType('pickup')}
                                        >
                                            <Ionicons
                                                name="business"
                                                size={24}
                                                color={deliveryType === 'pickup' ? theme.colors.accent : '#666'}
                                            />
                                            <Text style={[styles.optionCardText, deliveryType === 'pickup' && styles.optionCardTextActive]}>Retrait</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {deliveryType === 'delivery' && (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Adresse de livraison</Text>
                                        <View style={styles.addressInput}>
                                            <Ionicons name="location-outline" size={20} color={theme.colors.accent} />
                                            <DebouncedTextInput
                                                style={styles.addressTextField}
                                                placeholder="Entrez votre adresse..."
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                value={address}
                                                onChangeText={setAddress}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Payment Method */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Mode de paiement</Text>
                                    <TouchableOpacity style={styles.paymentSelector} activeOpacity={0.8}>
                                        <View style={styles.paymentInfo}>
                                            <View style={styles.paymentIcon}>
                                                <Ionicons name="phone-portrait-outline" size={20} color={theme.colors.accent} />
                                            </View>
                                            <View>
                                                <Text style={styles.paymentName}>Mobile Money</Text>
                                                <Text style={styles.paymentSub}>Orange Money / Moov Money</Text>
                                            </View>
                                        </View>
                                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.accent} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.summaryInfo}>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Sous-total</Text>
                                        <Text style={styles.summaryValue}>{Format.price(total)}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Frais de service</Text>
                                        <Text style={styles.summaryValue}>{Format.price(0)}</Text>
                                    </View>
                                    <View style={[styles.summaryRow, styles.finalRow]}>
                                        <Text style={styles.finalLabel}>Total à payer</Text>
                                        <Text style={styles.finalValue}>{Format.price(total)}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.orderButton, (isCheckingOut || cartItems.length === 0) && styles.disabledButton]}
                            onPress={handleCheckout}
                            disabled={isCheckingOut || cartItems.length === 0}
                        >
                            {isCheckingOut ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.orderButtonText}>PASSER LA COMMANDE</Text>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.secureText}>
                            <Ionicons name="lock-closed" size={12} color="#666" /> Paiement 100% sécurisé
                        </Text>
                    </View>
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
        backgroundColor: '#1a1d2e',
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
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    emptyContainer: {
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
    shopBtn: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 25,
    },
    shopBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemsCount: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        fontWeight: '600',
    },
    clearCartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 8,
    },
    clearCartText: {
        color: theme.colors.error,
        fontSize: 12,
        fontWeight: 'bold',
    },
    itemsSection: {
        marginBottom: 24,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    },
    totalLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        color: theme.colors.accent,
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    optionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    optionCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionCardActive: {
        borderColor: theme.colors.accent,
        backgroundColor: 'rgba(0,191,255,0.05)',
    },
    optionCardText: {
        color: '#666',
        fontSize: 12,
        marginTop: 8,
        fontWeight: 'bold',
    },
    optionCardTextActive: {
        color: theme.colors.accent,
    },
    paymentSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,191,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    paymentSub: {
        color: '#666',
        fontSize: 11,
    },
    addressInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 12,
    },
    addressTextField: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
    },
    summaryInfo: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        marginBottom: 40,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        color: '#666',
        fontSize: 14,
    },
    summaryValue: {
        color: '#fff',
        fontSize: 14,
    },
    finalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    finalLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    finalValue: {
        color: theme.colors.accent,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    orderButton: {
        backgroundColor: theme.colors.accent,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: '#333',
        shadowOpacity: 0,
    },
    orderButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    secureText: {
        color: '#666',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 12,
    },
});
