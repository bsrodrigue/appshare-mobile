import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '@/ui/theme';
import { Ionicons } from '@expo/vector-icons';

interface DeliveryDriverRowProps {
    name: string;
    imageUrl?: string;
    statusText?: string;
    onPress?: () => void;
}

export const DeliveryDriverRow = ({ name, imageUrl, statusText, onPress }: DeliveryDriverRowProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="image-outline" size={24} color="#999" />
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.name}>{name}</Text>
                {statusText && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{statusText}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.textWhite, // White background for the row
        marginBottom: theme.spacing.xs, // Small gap between rows
        height: 60,
        alignItems: 'center',
    },
    imageContainer: {
        width: 60,
        height: '100%',
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
    },
    name: {
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        color: '#000',
    },
    badge: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 2,
    },
    badgeText: {
        color: theme.colors.textWhite,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
