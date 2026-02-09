import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/ui/theme';
import { Ionicons } from '@expo/vector-icons';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    max?: number;
    size?: 'small' | 'medium';
}

export const QuantitySelector = ({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    max,
    size = 'medium',
}: QuantitySelectorProps) => {
    const isSmall = size === 'small';

    const canDecrease = quantity > min;
    const canIncrease = max === undefined || quantity < max;

    return (
        <View style={[styles.container, isSmall && styles.containerSmall]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    isSmall && styles.buttonSmall,
                    !canDecrease && styles.buttonDisabled
                ]}
                onPress={onDecrease}
                disabled={!canDecrease}
                activeOpacity={0.7}
            >
                <Ionicons name="remove" size={isSmall ? 14 : 18} color={canDecrease ? theme.colors.accent : 'rgba(255,255,255,0.2)'} />
            </TouchableOpacity>

            <View style={[styles.valueWrapper, isSmall && styles.valueWrapperSmall]}>
                <Text style={[styles.valueText, isSmall && styles.valueTextSmall]}>
                    {quantity}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    styles.increaseButton,
                    isSmall && styles.buttonSmall,
                    !canIncrease && styles.buttonDisabled
                ]}
                onPress={onIncrease}
                disabled={!canIncrease}
                activeOpacity={0.7}
            >
                <Ionicons name="add" size={isSmall ? 14 : 18} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 25,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    containerSmall: {
        borderRadius: 20,
        padding: 2,
    },
    button: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    increaseButton: {
        backgroundColor: theme.colors.accent,
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        shadowOpacity: 0,
        elevation: 0,
    },
    valueWrapper: {
        minWidth: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueWrapperSmall: {
        minWidth: 22,
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    valueTextSmall: {
        fontSize: 13,
    },
});
