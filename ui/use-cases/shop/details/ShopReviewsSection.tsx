import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

interface ShopReviewsSectionProps {
    shopRating: number;
    reviewCount: number;
    reviews: Review[];
    renderStars: (rating: number, size?: number) => React.ReactNode;
}

export const ShopReviewsSection = ({
    shopRating,
    reviewCount,
    reviews,
    renderStars,
}: ShopReviewsSectionProps) => {
    return (
        <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Avis Clients</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>Voir tout</Text>
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.reviewsOverview}>
                <View style={styles.reviewsLeft}>
                    <Text style={styles.bigRating}>{shopRating}</Text>
                    <View style={styles.starsRow}>
                        {renderStars(shopRating, 18)}
                    </View>
                    <Text style={styles.reviewsBasedOn}>Base sur {reviewCount} avis</Text>
                </View>
                <View style={styles.ratingBars}>
                    {[5, 4, 3, 2, 1].map((stars) => (
                        <View key={stars} style={styles.ratingBarRow}>
                            <Text style={styles.ratingBarLabel}>{stars}</Text>
                            <Ionicons name="star" size={10} color="#FFD700" />
                            <View style={styles.ratingBarBg}>
                                <View style={[styles.ratingBarFill, { width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }]} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewsList}>
                {reviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewCardHeader}>
                            <View style={styles.reviewAvatar}>
                                <Text style={styles.reviewAvatarText}>{review.userName.charAt(0)}</Text>
                            </View>
                            <View style={styles.reviewUserInfo}>
                                <Text style={styles.reviewUserName}>{review.userName}</Text>
                                <Text style={styles.reviewDate}>{review.date}</Text>
                            </View>
                            <View style={styles.reviewStars}>
                                {renderStars(review.rating, 12)}
                            </View>
                        </View>
                        <Text style={styles.reviewComment} numberOfLines={3}>{review.comment}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewsSection: {
        padding: theme.spacing.md,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
        marginBottom: 12,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    reviewsOverview: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    reviewsLeft: {
        alignItems: 'center',
        paddingRight: 20,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.1)',
    },
    bigRating: {
        fontSize: 40,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
    },
    starsRow: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    reviewsBasedOn: {
        fontSize: 11,
        color: theme.colors.textLight,
        marginTop: 4,
    },
    ratingBars: {
        flex: 1,
        paddingLeft: 20,
        justifyContent: 'center',
        gap: 4,
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingBarLabel: {
        fontSize: 11,
        color: theme.colors.textLight,
        width: 12,
    },
    ratingBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 3,
    },
    reviewsList: {
        marginLeft: -theme.spacing.md,
        paddingLeft: theme.spacing.md,
    },
    reviewCard: {
        width: 260,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
    },
    reviewCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewAvatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    reviewUserInfo: {
        flex: 1,
        marginLeft: 10,
    },
    reviewUserName: {
        color: theme.colors.textWhite,
        fontWeight: '600',
        fontSize: 14,
    },
    reviewDate: {
        color: theme.colors.textLight,
        fontSize: 11,
    },
    reviewStars: {
        flexDirection: 'row',
    },
    reviewComment: {
        color: theme.colors.textLight,
        fontSize: 13,
        lineHeight: 18,
    },
});
