import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '@/ui/theme';
import { Ionicons } from '@expo/vector-icons';

export type PharmacyStatus = 'Ouvert' | 'Fermé' | 'Garde';

interface PharmacyCardProps {
    name: string;
    location: string;
    distance: string;
    status: string; // Keeping string to allow flexibility matching the screenshot text exactly (e.g. "ouvert", "fermé")
    imageUrl?: string;
    onPress?: () => void;
}

export const PharmacyCard = ({ name, location, distance, status, imageUrl, onPress }: PharmacyCardProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="image" size={30} color="#ccc" />
                    </View>
                )}
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
                <View style={styles.infoRow}>
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.locationText}>
                            {location} - <Text style={styles.distance}>{distance}</Text>
                        </Text>
                    </View>

                    {/* Status Badge */}
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{status}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.textWhite,
        marginBottom: theme.spacing.sm,
        height: 80,
        alignItems: 'center',
        paddingRight: theme.spacing.sm,
    },
    imageContainer: {
        width: 80,
        height: '100%',
        backgroundColor: '#e0e0e0',
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
        backgroundColor: '#ddd',
    },
    contentContainer: {
        flex: 1,
        paddingLeft: theme.spacing.md,
        justifyContent: 'center',
        height: '100%',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    name: {
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    locationText: {
        fontSize: theme.fontSize.sm,
        color: '#000',
    },
    distance: {
        color: '#00AEEF', // Cyan/Blue color from screenshot
        fontWeight: 'bold',
    },
    statusBadge: {
        backgroundColor: theme.colors.accent, // Orange
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
    },
    statusText: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
});
