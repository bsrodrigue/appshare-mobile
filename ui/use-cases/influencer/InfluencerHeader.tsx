import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { theme, typography } from '@/ui/theme';
import { StaticAvatar } from '@/ui/use-cases/shared/components/StaticAvatar';

interface InfluencerHeaderProps {
    name: string;
    avatarUrl?: string;
    isInfluencerMode: boolean;
    onToggleMode: (value: boolean) => void;
    onNotificationPress?: () => void;
    onMenuPress?: () => void;
}

export const InfluencerHeader = ({
    name,
    avatarUrl,
    isInfluencerMode,
    onToggleMode,
    onNotificationPress,
    onMenuPress
}: InfluencerHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <StaticAvatar
                    size={40}
                    source={avatarUrl ? { uri: avatarUrl } : undefined}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{name}</Text>
            </View>

            <View style={styles.centerSection}>
                <Switch
                    trackColor={{ false: "#767577", true: theme.colors.primary }}
                    thumbColor={theme.colors.textWhite}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onToggleMode}
                    value={isInfluencerMode}
                    style={styles.switch}
                />
                <Text style={styles.modeText}>Influenceur</Text>
            </View>

            <View style={styles.rightSection}>
                <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
                    <Ionicons name="notifications" size={24} color={theme.colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
                    <Entypo name="dots-three-vertical" size={20} color={theme.colors.textWhite} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        marginRight: theme.spacing.sm,
        borderWidth: 2,
    },
    name: {
        ...typography.h3,
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        maxWidth: 100, // Truncate long names if needed
    },
    centerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacing.sm,
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        marginRight: 4,
    },
    modeText: {
        color: theme.colors.textWhite,
        fontSize: 10,
        fontWeight: 'bold',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: theme.spacing.sm,
        padding: 4,
    },
});
