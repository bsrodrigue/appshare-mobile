import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/ui/theme';

interface DeliveryHistoryRowProps {
    location: string;
    type: string;
    price: string;
    date: string;
    onPress?: () => void;
}

export const DeliveryHistoryRow = ({ location, type, price, date, onPress }: DeliveryHistoryRowProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
            <View style={[styles.cell, styles.locationCell]}>
                <Text style={styles.text} numberOfLines={1}>{location}</Text>
            </View>
            <View style={[styles.cell, styles.typeCell]}>
                <Text style={styles.text} numberOfLines={1}>{type}</Text>
            </View>
            <View style={[styles.cell, styles.priceCell]}>
                <Text style={styles.text}>{price}</Text>
            </View>
            <View style={[styles.cell, styles.dateCell]}>
                <Text style={styles.dateText}>{date}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xs,
        height: 40,
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginRight: 2,
    },
    locationCell: {
        flex: 3,
        backgroundColor: theme.colors.accent, // Orange
    },
    typeCell: {
        flex: 2,
        backgroundColor: '#3498db', // Blue
    },
    priceCell: {
        flex: 1.5,
        backgroundColor: theme.colors.accent, // Orange
    },
    dateCell: {
        flex: 2,
        backgroundColor: theme.colors.textWhite, // White
        marginRight: 0,
    },
    text: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dateText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
