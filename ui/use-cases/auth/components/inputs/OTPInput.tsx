import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { theme } from '@/ui/theme';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

export const OTPInput = ({ length = 6, value, onChange, error }: OTPInputProps) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Create an array of length `length` to map over for rendering boxes
    const boxes = Array(length).fill(0);

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const isSixDigit = length > 4;
    const boxSize = isSixDigit ? 45 : 60;
    const boxGap = isSixDigit ? theme.spacing.sm : theme.spacing.md;
    const digitFontSize = isSixDigit ? 24 : 32;

    return (
        <Pressable style={styles.container} onPress={handlePress}>
            {/* Hidden TextInput to handle the actual input logic */}
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={(text) => {
                    // Only allow numeric input and limit length
                    const numericValue = text.replace(/[^0-9]/g, '');
                    if (numericValue.length <= length) {
                        onChange(numericValue);
                    }
                }}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={length}
                style={styles.hiddenInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {/* Visible Boxes */}
            <View style={[styles.boxesContainer, { gap: boxGap }]}>
                {boxes.map((_, index) => {
                    const digit = value[index];
                    const isCurrent = index === value.length && isFocused;
                    const isFilled = !!digit;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.box,
                                { width: boxSize, height: boxSize },
                                isFilled && styles.boxFilled,
                                isCurrent && styles.boxActive,
                                error && styles.boxError,
                            ]}
                        >
                            <Text style={[styles.digit, { fontSize: digitFontSize }]}>
                                {digit ? '*' : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
        width: '100%',
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    boxesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    box: {
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.otpBox,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    boxFilled: {
        backgroundColor: theme.colors.otpBox,
    },
    boxActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.otpBoxActive,
    },
    boxError: {
        borderColor: theme.colors.error,
    },
    digit: {
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 8, // Visual adjustment for the asterisk
    },
});
