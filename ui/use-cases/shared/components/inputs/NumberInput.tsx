import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface NumberInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export const NumberInput = ({ value, onChangeText }: NumberInputProps) => {
    const handleIncrement = () => {
        const num = parseInt(value || '0');
        onChangeText((num + 1).toString().padStart(2, '0'));
    };

    const handleDecrement = () => {
        const num = parseInt(value || '0');
        if (num > 0) {
            onChangeText((num - 1).toString().padStart(2, '0'));
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
                textAlign="center"
                editable={true}
            />
            <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={handleIncrement}>
                    <Ionicons name="chevron-up" size={12} color={theme.colors.textWhite} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={handleDecrement}>
                    <Ionicons name="chevron-down" size={12} color={theme.colors.textWhite} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: theme.borderRadius.sm,
        height: 32,
        width: 70,
    },
    input: {
        flex: 1,
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        color: theme.colors.text,
        padding: 0,
        height: '100%',
    },
    controls: {
        width: 20,
        height: '100%',
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButton: {
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
