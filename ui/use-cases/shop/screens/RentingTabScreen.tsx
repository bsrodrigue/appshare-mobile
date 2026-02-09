import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

export function RentingTabScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>BIENTOT DISPONIBLE</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
