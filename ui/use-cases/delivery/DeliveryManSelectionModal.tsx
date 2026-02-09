import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { DeliveryManCard } from './DeliveryManCard';

interface DeliveryMan {
    id: number;
    name: string;
    avatar_url?: string;
    vehicle_type?: string;
    status: 'available' | 'waiting' | 'busy';
    estimated_price?: number;
}

interface DeliveryManSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (deliveryManId: number) => void;
    deliveryMen: DeliveryMan[];
    isLoading?: boolean;
    pickupLocation: string;
    deliveryLocation: string;
}

export const DeliveryManSelectionModal = ({
    visible,
    onClose,
    onSelect,
    deliveryMen,
    isLoading = false,
    pickupLocation,
    deliveryLocation,
}: DeliveryManSelectionModalProps) => {
    const [selectedDeliveryManId, setSelectedDeliveryManId] = useState<number | null>(null);

    const availableDeliveryMen = deliveryMen.filter(dm => dm.status === 'available');
    const waitingDeliveryMen = deliveryMen.filter(dm => dm.status === 'waiting');

    const handleAccept = (deliveryManId: number) => {
        setSelectedDeliveryManId(deliveryManId);
        onSelect(deliveryManId);
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.locationInfo}>
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={16} color="#3498db" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {pickupLocation}
                    </Text>
                </View>
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={16} color="#ff4444" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {deliveryLocation}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderWaitingState = () => (
        <View style={styles.waitingContainer}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>elite</Text>
                <Text style={styles.waitingText}>En attente d'un livreur</Text>
            </View>
        </View>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.accent} />
                    <Text style={styles.loadingText}>Recherche de livreurs...</Text>
                </View>
            );
        }

        if (availableDeliveryMen.length === 0 && waitingDeliveryMen.length > 0) {
            return renderWaitingState();
        }

        return (
            <FlatList
                data={deliveryMen}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <DeliveryManCard
                        name={item.name}
                        imageUrl={item.avatar_url}
                        vehicleType={item.vehicle_type}
                        status={item.status}
                        price={item.estimated_price}
                        onAccept={() => handleAccept(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucun livreur disponible</Text>
                    </View>
                }
            />
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>

                {renderHeader()}
                {renderContent()}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#fff',
        padding: theme.spacing.md,
        paddingTop: 60, // Account for close button
    },
    locationInfo: {
        gap: theme.spacing.xs,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    locationText: {
        flex: 1,
        fontSize: theme.fontSize.sm,
        color: '#000',
    },
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: theme.spacing.sm,
    },
    waitingText: {
        fontSize: theme.fontSize.base,
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.fontSize.sm,
        color: '#fff',
    },
    listContent: {
        padding: theme.spacing.md,
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: theme.fontSize.sm,
        color: '#999',
    },
});
