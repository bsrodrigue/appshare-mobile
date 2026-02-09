import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo = ({ size = 'lg' }: LogoProps) => {
    const getScale = () => {
        switch (size) {
            case 'sm': return 0.6;
            case 'md': return 0.8;
            case 'xl': return 1.5;
            default: return 1;
        }
    };

    const scale = getScale();

    return (
        <View style={[styles.logoContainer, { transform: [{ scale }] }]}>
            <Text style={styles.text}>el</Text>
            <View style={styles.iContainer}>
                <View style={styles.dot} />
                <View style={styles.stem} />
            </View>
            <Text style={styles.text}>te</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 50,
    },
    text: {
        fontWeight: '800',
        fontSize: 40,
        color: theme.colors.textWhite,
        letterSpacing: -1,
        lineHeight: 42,
    },
    iContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 12,
        height: 42,
        marginHorizontal: 1,
        paddingBottom: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.accent,
        marginBottom: 4,
    },
    stem: {
        width: 10,
        height: 21,
        backgroundColor: theme.colors.textWhite,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
});
