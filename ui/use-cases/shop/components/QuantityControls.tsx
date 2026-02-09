import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '@/ui/theme';

interface QuantityControlsProps {
    isLoading?: boolean;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export const QuantityControls = ({
    isLoading,
    quantity,
    onIncrease,
    onDecrease,
}: QuantityControlsProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.decreaseButton}
                onPress={onDecrease}
                disabled={quantity === 0 || isLoading}
            >
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>

            <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>{String(quantity).padStart(2, '0')}</Text>
            </View>

            <TouchableOpacity
                style={styles.increaseButton}
                onPress={onIncrease}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={theme.colors.accent} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderColor: theme.colors.accent,
        borderWidth: 1,
        position: 'relative',
    },
    decreaseButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    increaseButton: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    quantityBadge: {
        paddingVertical: 2,
        minWidth: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        color: theme.colors.text,
        fontSize: 11,
        fontWeight: 'bold',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
