import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

interface DetailCardProps {
    title?: string;
    children: React.ReactNode;
}

export const DetailCard = ({ title, children }: DetailCardProps) => {
    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.textWhite,
        borderRadius: theme.borderRadius.xs,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
        color: '#000',
    },
});
