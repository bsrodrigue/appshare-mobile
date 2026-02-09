import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '@/ui/theme';
import { Header } from '@/ui/use-cases/shared/layout/Header';
import { useAuthStore } from '@/store/auth';

type DeliveryStatus = 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'approaching' | 'delivered' | 'cancelled';

interface StatusTimelineItem {
    status: DeliveryStatus;
    label: string;
    time?: string;
    completed: boolean;
}

export default function DeliveryTrackingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuthStore();
    const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('accepted');
    const [deliveryManLocation, setDeliveryManLocation] = useState({ lat: 12.3714, lng: -1.5197 });

    const deliveryManInfo = {
        name: 'Mamadou Koné',
        phone: '+226 XX XX XX XX',
        vehicleType: 'Moto',
        rating: 4.8,
        imageUrl: 'https://ui-avatars.com/api/?name=Mamadou+Kone&background=ff6b4a&color=fff&size=100&bold=true',
    };

    const statusTimeline: StatusTimelineItem[] = [
        { status: 'pending', label: 'Demande créée', time: '14:30', completed: true },
        { status: 'accepted', label: 'Livreur accepté', time: '14:32', completed: currentStatus !== 'pending' },
        { status: 'picked_up', label: 'Colis récupéré', time: currentStatus === 'picked_up' || currentStatus === 'in_transit' || currentStatus === 'approaching' || currentStatus === 'delivered' ? '14:45' : undefined, completed: currentStatus === 'picked_up' || currentStatus === 'in_transit' || currentStatus === 'approaching' || currentStatus === 'delivered' },
        { status: 'in_transit', label: 'En cours de livraison', time: currentStatus === 'in_transit' || currentStatus === 'approaching' || currentStatus === 'delivered' ? '14:50' : undefined, completed: currentStatus === 'in_transit' || currentStatus === 'approaching' || currentStatus === 'delivered' },
        { status: 'approaching', label: 'Proche de la destination', time: currentStatus === 'approaching' || currentStatus === 'delivered' ? '15:05' : undefined, completed: currentStatus === 'approaching' || currentStatus === 'delivered' },
        { status: 'delivered', label: 'Livraison effectuée', time: currentStatus === 'delivered' ? '15:10' : undefined, completed: currentStatus === 'delivered' },
    ];

    const getETA = () => {
        switch (currentStatus) {
            case 'accepted':
                return '15 min';
            case 'picked_up':
                return '20 min';
            case 'in_transit':
                return '10 min';
            case 'approaching':
                return '2 min';
            default:
                return '--';
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title={user ? `${user.first_name} ${user.last_name}` : 'Suivi'}
                avatarUrl={(user as any)?.avatar_url || "https://ui-avatars.com/api/?name=User&background=fff&color=000&size=100&bold=true"}
            />

            <ScrollView style={styles.content}>
                {/* Map Section */}
                <View style={styles.mapContainer}>
                    <Image
                        source={{ uri: `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${deliveryManLocation.lng},${deliveryManLocation.lat}&z=14&l=map&size=600,400&pt=${deliveryManLocation.lng},${deliveryManLocation.lat},pm2rdm` }}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />

                    {/* ETA Badge */}
                    <View style={styles.etaBadge}>
                        <Ionicons name="time-outline" size={16} color="#fff" />
                        <Text style={styles.etaText}>ETA: {getETA()}</Text>
                    </View>
                </View>

                {/* Delivery Man Info Card */}
                <View style={styles.deliveryManCard}>
                    <Image
                        source={{ uri: deliveryManInfo.imageUrl }}
                        style={styles.deliveryManImage}
                    />
                    <View style={styles.deliveryManInfo}>
                        <Text style={styles.deliveryManName}>{deliveryManInfo.name}</Text>
                        <View style={styles.deliveryManMeta}>
                            <Ionicons name="bicycle" size={14} color="#666" />
                            <Text style={styles.deliveryManMetaText}>{deliveryManInfo.vehicleType}</Text>
                            <Ionicons name="star" size={14} color={theme.colors.accent} style={{ marginLeft: 8 }} />
                            <Text style={styles.deliveryManMetaText}>{deliveryManInfo.rating}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.callButton}>
                        <Ionicons name="call" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Status Timeline */}
                <View style={styles.timelineContainer}>
                    <Text style={styles.timelineTitle}>STATUT DE LA LIVRAISON</Text>
                    {statusTimeline.map((item, index) => (
                        <View key={item.status} style={styles.timelineItem}>
                            <View style={styles.timelineIconContainer}>
                                <View style={[
                                    styles.timelineIcon,
                                    item.completed && styles.timelineIconCompleted,
                                    currentStatus === item.status && styles.timelineIconActive,
                                ]}>
                                    {item.completed && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                                {index < statusTimeline.length - 1 && (
                                    <View style={[
                                        styles.timelineLine,
                                        item.completed && styles.timelineLineCompleted,
                                    ]} />
                                )}
                            </View>
                            <View style={styles.timelineContent}>
                                <Text style={[
                                    styles.timelineLabel,
                                    item.completed && styles.timelineLabelCompleted,
                                    currentStatus === item.status && styles.timelineLabelActive,
                                ]}>
                                    {item.label}
                                </Text>
                                {item.time && (
                                    <Text style={styles.timelineTime}>{item.time}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Current Status Badge */}
                <View style={styles.currentStatusContainer}>
                    <View style={styles.currentStatusBadge}>
                        <Text style={styles.currentStatusText}>
                            {statusTimeline.find(s => s.status === currentStatus)?.label || 'En cours'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
    },
    mapContainer: {
        height: 300,
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    etaBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    etaText: {
        color: '#fff',
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
    },
    deliveryManCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    deliveryManImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: theme.spacing.md,
    },
    deliveryManInfo: {
        flex: 1,
    },
    deliveryManName: {
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    deliveryManMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryManMetaText: {
        fontSize: theme.fontSize.xs,
        color: '#666',
        marginLeft: 4,
    },
    callButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineContainer: {
        backgroundColor: '#fff',
        margin: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
    },
    timelineTitle: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: theme.spacing.md,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: theme.spacing.sm,
    },
    timelineIconContainer: {
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    timelineIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineIconCompleted: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },
    timelineIconActive: {
        borderColor: theme.colors.accent,
        backgroundColor: theme.colors.accent,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#ccc',
        marginTop: 4,
    },
    timelineLineCompleted: {
        backgroundColor: theme.colors.primary,
    },
    timelineContent: {
        flex: 1,
        paddingTop: 2,
    },
    timelineLabel: {
        fontSize: theme.fontSize.sm,
        color: '#666',
    },
    timelineLabelCompleted: {
        color: '#000',
        fontWeight: '500',
    },
    timelineLabelActive: {
        color: theme.colors.accent,
        fontWeight: 'bold',
    },
    timelineTime: {
        fontSize: theme.fontSize.xs,
        color: '#999',
        marginTop: 2,
    },
    currentStatusContainer: {
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
    },
    currentStatusBadge: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    currentStatusText: {
        color: '#fff',
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
    },
});
