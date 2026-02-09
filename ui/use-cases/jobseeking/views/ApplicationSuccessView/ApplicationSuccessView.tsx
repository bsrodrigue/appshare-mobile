
import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { Button } from '@/ui/use-cases/shared/components/inputs/Button';
import { styles } from './styles';

export type ApplicationSuccessViewProps = {
    companyTitle: string;
    companyLogoUrl: string;
    jobTitle: string;
    jobLocation?: string;
    jobExperienceLevel?: string;
    message?: string;
    actionTitle?: string;
    onActionPress: () => void;
};

export default function ApplicationSuccessView({
    companyTitle,
    companyLogoUrl,
    jobTitle,
    jobLocation,
    jobExperienceLevel,
    message = "Votre candidature est en cours d’envoi.\nVous allez bientôt recevoir un mail de\nconfirmation",
    actionTitle = "Voir d'autres offres",
    onActionPress,
}: ApplicationSuccessViewProps) {
    return (
        <View style={styles.content}>
            <View style={styles.companyHeader}>
                <Image
                    source={{ uri: companyLogoUrl }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.companyName} numberOfLines={1}>
                    {companyTitle}
                </Text>
            </View>

            <Text style={styles.jobTitle}>
                {jobTitle}
            </Text>

            <View style={styles.metaRow}>
                {!!jobLocation && (
                    <View style={styles.metaItem}>
                        <Ionicons name="location-sharp" size={12} color={theme.colors.accent} />
                        <Text style={styles.metaText} numberOfLines={1}>{jobLocation}</Text>
                    </View>
                )}

                {!!jobExperienceLevel && (
                    <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="school" size={12} color={theme.colors.accent} />
                        <Text style={styles.metaText} numberOfLines={1}>{jobExperienceLevel}</Text>
                    </View>
                )}
            </View>

            <View style={styles.successCard}>
                <Text style={styles.successText}>{message}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title={actionTitle}
                    onPress={onActionPress}
                    style={styles.actionButton}
                    textStyle={{ fontWeight: 'bold', fontSize: 16 }}
                />
            </View>
        </View>
    );
}

