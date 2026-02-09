import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@/ui/theme';

interface DeliveryManCardProps {
    name: string;
    imageUrl?: string;
    vehicleType?: string;
    status: 'available' | 'waiting' | 'busy';
    price?: number;
    onPress?: () => void;
    onAccept?: () => void;
}

export const DeliveryManCard = ({
    name,
    imageUrl,
    vehicleType = 'motorcycle',
    status,
    price,
    onPress,
    onAccept,
}: DeliveryManCardProps) => {
    const getStatusText = () => {
        switch (status) {
            case 'available':
                return 'Disponible';
            case 'waiting':
                return 'Attente...';
            case 'busy':
                return 'Occupé';
            default:
                return '';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'available':
                return theme.colors.accent;
            case 'waiting':
                return '#ff9800';
            case 'busy':
                return '#999';
            default:
                return '#999';
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.content}>
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>
                                {name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                        <Text style={styles.statusText}>{getStatusText()}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                {status === 'available' && price !== undefined && onAccept && (
                    <View style={styles.actions}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>{price} CFA</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                onAccept();
                            }}
                        >
                            <Text style={styles.acceptButtonText}>ACCEPTER</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.xs,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.sm,
    },
    imageContainer: {
        marginRight: theme.spacing.sm,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    imagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    actions: {
        alignItems: 'flex-end',
    },
    priceContainer: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: 2,
        marginBottom: 4,
    },
    priceText: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: '#fff',
    },
    acceptButton: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: 2,
    },
    acceptButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
});
