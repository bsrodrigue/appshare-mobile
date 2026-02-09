import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

interface HistoryRowProps {
    label: string;
    date: string;
}

export const HistoryRow = ({ label, date }: HistoryRowProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.labelText} numberOfLines={1}>{label}</Text>
            </View>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{date}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 35,
        marginBottom: theme.spacing.xs,
    },
    labelContainer: {
        flex: 2,
        backgroundColor: '#666', // Lighter gray for label
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.sm,
        marginRight: 2,
    },
    labelText: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    dateContainer: {
        flex: 1,
        backgroundColor: '#999', // Even lighter gray for date
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
