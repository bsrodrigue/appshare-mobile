import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { CourseListResource } from '@/features/courses/types';

interface CourseCardProps {
    course: CourseListResource;
    onPress?: () => void;
}

export const CourseCard = ({ course, onPress }: CourseCardProps) => {
    const formatDistance = (km: number) => `${km.toFixed(1)} Km`;
    const formatDuration = (km: number) => {
        // Rough estimate: ~3km per 15min in city traffic
        const minutes = Math.round((km / 3) * 15);
        return `${minutes} min`;
    };

    const formatPrice = (price: number) => `${price} CFA`;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.content}>
                {/* Header / Reference */}
                <View style={styles.header}>
                    <Text style={styles.recipientText}>{course.reference}</Text>
                    {course.status === 'pending' && (
                        <View style={styles.liveBadge}>
                            <Text style={styles.liveText}>EN ATTENTE</Text>
                        </View>
                    )}
                </View>

                {/* Pickup Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={16} color="#FF3B30" style={styles.icon} />
                    <Text style={styles.locationText} numberOfLines={1}>
                        Récupération {course.pickup_address}
                    </Text>
                </View>

                {/* Delivery Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={16} color="#00bfff" style={styles.icon} />
                    <Text style={styles.locationText} numberOfLines={1}>
                        Livraison {course.dropoff_address}
                    </Text>
                </View>

                {/* Meta Info: Distance & Duration */}
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                        {formatDistance(course.distance_km)} - {formatDuration(course.distance_km)}
                    </Text>
                </View>

                {/* Price */}
                <Text style={styles.priceText}>{formatPrice(course.final_fee || course.estimated_fee)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.whiteBackground,
        borderRadius: theme.borderRadius.xs,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    recipientText: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.bold,
        color: '#000',
        flex: 1,
    },
    liveBadge: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 2,
    },
    liveText: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: theme.fontWeight.bold,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    icon: {
        marginRight: theme.spacing.sm,
    },
    locationText: {
        fontSize: theme.fontSize.sm,
        color: '#333',
        flex: 1,
    },
    metaRow: {
        marginTop: theme.spacing.xs,
        paddingLeft: 24, // Align with location text (icon width + margin)
    },
    metaText: {
        fontSize: theme.fontSize.sm,
        color: '#000',
    },
    priceText: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.accent,
    },
});
