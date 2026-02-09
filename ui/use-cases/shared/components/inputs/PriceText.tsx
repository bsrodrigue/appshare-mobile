import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { theme } from '@/ui/theme';
import { Format } from '@/libs/fmt';

interface PriceTextProps {
    amount: number;
    showCurrency?: boolean;
    style?: StyleProp<TextStyle>;
}

export const PriceText = ({ amount, showCurrency = true, style }: PriceTextProps) => {
    return (
        <Text style={[{ color: theme.colors.accent, fontWeight: 'bold' }, style]}>
            {Format.price(amount, showCurrency)}
        </Text>
    );
};
