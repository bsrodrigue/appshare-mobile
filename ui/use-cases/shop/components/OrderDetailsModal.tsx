import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { OrderResource } from '@/features/orders/types';
import { Format } from '@/libs/fmt';
import { useCancelOrder } from '@/features/orders/hooks';
import { useRealtime } from '@/hooks/realtime';

interface OrderDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    order: OrderResource | null;
    onOrderCancelled?: () => void;
}

export const OrderDetailsModal = ({
    visible,
    onClose,
    order,
    onOrderCancelled,
}: OrderDetailsModalProps) => {
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const { cancelOrder, isLoading: isCancelling } = useCancelOrder({
        onSuccess: () => {
            Alert.alert('Succès', 'Commande annulée avec succès');
            setShowCancelForm(false);
            setCancelReason('');
            onOrderCancelled?.();
            onClose();
        },
        onError: (error) => {
            Alert.alert('Erreur', error || 'Impossible d\'annuler la commande');
        },
    });

    if (!order) return null;

    const handleCancelOrder = () => {
        if (!cancelReason.trim()) {
            Alert.alert('Attention', 'Veuillez indiquer la raison de l\'annulation');
            return;
        }

        Alert.alert(
            'Confirmer l\'annulation',
            'Êtes-vous sûr de vouloir annuler cette commande ?',
            [
                { text: 'Non', style: 'cancel' },
                {
                    text: 'Oui, annuler',
                    style: 'destructive',
                    onPress: () => {
                        cancelOrder({ id: order.id, reason: cancelReason });
                    },
                },
            ]
        );
    };

    const canCancel = ['pending', 'confirmed', 'preparing'].includes(order.status);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return '#27ae60';
            case 'cancelled':
                return '#e74c3c';
            case 'in_delivery':
                return '#3498db';
            case 'preparing':
            case 'ready':
                return '#f39c12';
            default:
                return theme.colors.accent;
        }
    };

    const formatDeliveryAddress = (address: any) => {
        if (!address) return null;

        // If it's a string, return it directly
        if (typeof address === 'string') {
            return address;
        }

        // If it's an object with address property
        if (typeof address === 'object') {
            // Check if it's an array (empty array case)
            if (Array.isArray(address) && address.length === 0) {
                return null;
            }

            // If it has an address property, use that
            if (address.address) {
                return address.address;
            }

            // Try to construct a readable address from coordinates
            if (address.latitude && address.longitude) {
                return `Coordonnées: ${address.latitude.toFixed(4)}, ${address.longitude.toFixed(4)}`;
            }
        }

        return null;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Détails de la commande</Text>
                            <Text style={styles.reference}>#{order.reference}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Status Badge */}
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                            <Text style={styles.statusText}>{order.status_label}</Text>
                        </View>

                        {order.shop && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Boutique</Text>
                                <View style={styles.infoRow}>
                                    <Ionicons name="storefront" size={20} color={theme.colors.accent} />
                                    <Text style={styles.infoText}>{order.shop.name}</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Articles commandés</Text>
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item) => (
                                    <View key={item.id} style={styles.itemRow}>
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName}>{item.product_name}</Text>
                                            <Text style={styles.itemQuantity}>Quantité: {item.quantity}</Text>
                                        </View>
                                        <View style={styles.itemPrices}>
                                            <Text style={styles.itemPrice}>{Format.price(item.unit_price)}</Text>
                                            <Text style={styles.itemTotal}>{Format.price(item.total_price)}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noItemsText}>Aucun article</Text>
                            )}
                        </View>

                        {/* Delivery Info */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Livraison</Text>
                            <View style={styles.infoRow}>
                                <Ionicons
                                    name={order.delivery_type === 'delivery' ? 'bicycle' : 'bag-handle'}
                                    size={20}
                                    color={theme.colors.accent}
                                />
                                <Text style={styles.infoText}>
                                    {order.delivery_type === 'delivery' ? 'Livraison à domicile' : 'Retrait en boutique'}
                                </Text>
                            </View>
                            {(() => {
                                const formattedAddress = formatDeliveryAddress(order.delivery_address);
                                return formattedAddress ? (
                                    <View style={styles.addressContainer}>
                                        <Ionicons name="location-outline" size={16} color="#999" />
                                        <Text style={styles.addressText}>{formattedAddress}</Text>
                                    </View>
                                ) : null;
                            })()}
                        </View>

                        {/* Payment Info */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Paiement</Text>
                            <View style={styles.infoRow}>
                                <Ionicons name="card" size={20} color={theme.colors.accent} />
                                <Text style={styles.infoText}>
                                    {order.payment_method || 'Non spécifié'}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
                                <Text style={styles.infoText}>Statut: {order.payment_status}</Text>
                            </View>
                        </View>

                        {/* Price Breakdown */}
                        <View style={styles.section}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Sous-total</Text>
                                <Text style={styles.priceValue}>{Format.price(order.subtotal)}</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Frais de livraison</Text>
                                <Text style={styles.priceValue}>{Format.price(order.delivery_fee)}</Text>
                            </View>
                            <View style={[styles.priceRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>{Format.price(order.total)}</Text>
                            </View>
                        </View>

                        {/* Order Date */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Date de commande</Text>
                            <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
                        </View>

                        {/* Cancel Form */}
                        {showCancelForm && canCancel && (
                            <View style={styles.cancelForm}>
                                <Text style={styles.cancelFormTitle}>Raison de l'annulation</Text>
                                <TextInput
                                    style={styles.cancelInput}
                                    placeholder="Expliquez pourquoi vous annulez cette commande..."
                                    placeholderTextColor="#666"
                                    value={cancelReason}
                                    onChangeText={setCancelReason}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                                <View style={styles.cancelButtonRow}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.secondaryButton]}
                                        onPress={() => {
                                            setShowCancelForm(false);
                                            setCancelReason('');
                                        }}
                                    >
                                        <Text style={styles.secondaryButtonText}>Retour</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.dangerButton]}
                                        onPress={handleCancelOrder}
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.buttonText}>Confirmer l'annulation</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer Actions */}
                    {!showCancelForm && canCancel && (
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowCancelForm(true)}
                            >
                                <Ionicons name="close-circle" size={20} color="#fff" />
                                <Text style={styles.buttonText}>Annuler la commande</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        color: '#fff',
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
    reference: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.sm,
        marginTop: 4,
    },
    content: {
        padding: 16,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        marginLeft: 12,
        flex: 1,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: 32,
        marginTop: 4,
        gap: 6,
    },
    addressText: {
        color: '#999',
        fontSize: theme.fontSize.sm,
        flex: 1,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemQuantity: {
        color: '#999',
        fontSize: theme.fontSize.sm,
    },
    itemPrices: {
        alignItems: 'flex-end',
    },
    itemPrice: {
        color: '#999',
        fontSize: theme.fontSize.sm,
        marginBottom: 4,
    },
    itemTotal: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    noItemsText: {
        color: '#999',
        fontSize: theme.fontSize.md,
        fontStyle: 'italic',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        color: '#999',
        fontSize: theme.fontSize.md,
    },
    priceValue: {
        color: '#fff',
        fontSize: theme.fontSize.md,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: {
        color: '#fff',
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
    totalValue: {
        color: theme.colors.accent,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
    dateText: {
        color: '#fff',
        fontSize: theme.fontSize.md,
    },
    cancelForm: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    cancelFormTitle: {
        color: '#e74c3c',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    cancelInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: theme.fontSize.md,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(231, 76, 60, 0.3)',
        minHeight: 100,
    },
    cancelButtonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 8,
        gap: 8,
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    dangerButton: {
        backgroundColor: '#e74c3c',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonText: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: '#999',
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        marginTop: 12,
    },
});
