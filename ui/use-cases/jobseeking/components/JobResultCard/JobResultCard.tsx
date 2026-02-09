import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { theme } from '@/ui/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { DateTimeService } from '@/libs/datetime';

interface JobResultCardProps {
    title?: string;
    company?: string;
    reference: string;
    location: string;
    education: string;
    timeAgo: string;
    logoUrl: string;
    onPress?: () => void;
}

const JobResultCard = ({
    title,
    company,
    reference,
    location,
    education,
    timeAgo,
    logoUrl,
    onPress
}: JobResultCardProps) => {

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain"/>
            </View>

            <View style={styles.contentContainer}>
                {title && <Text style={styles.title} onPress={onPress}>{title}</Text>}
                {company && <Text style={styles.company} onPress={onPress}>{company}</Text>}

                <Text style={styles.description} numberOfLines={3}>
                    <Text style={styles.boldLabel}>Référence: </Text>
                    {reference}
                </Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="location-sharp" size={12} color={theme.colors.accent} />
                        <Text style={styles.metaText}>{location}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="school" size={12} color={theme.colors.accent} />
                        <Text style={styles.metaText}>{education}</Text>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.timeContainer}>
                        <Ionicons name="time-outline" size={12} color="#fff" />
                        <Text style={styles.timeText}>{DateTimeService.format(timeAgo, "DD MMMM YYYY")}</Text>
                    </View>
                    <TouchableOpacity style={styles.applyBadge} onPress={onPress}>
                        <Text style={styles.applyText}>Postuler maintenant</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default JobResultCard;