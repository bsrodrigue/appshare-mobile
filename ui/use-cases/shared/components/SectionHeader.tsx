import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { theme, typography } from '@/ui/theme';
import { StaticAvatar } from '@/ui/use-cases/shared/components/StaticAvatar';

interface SectionHeaderProps {
    title: string;
    avatarUrl?: string;
    onMenuPress?: () => void;
}

export const SectionHeader = ({ title, avatarUrl, onMenuPress }: SectionHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <StaticAvatar
                    size={40}
                    source={avatarUrl ? { uri: avatarUrl } : undefined}
                    style={styles.avatar}
                />
                <Text style={styles.title}>{title}</Text>
            </View>

            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                <Entypo name="dots-three-vertical" size={20} color={theme.colors.disabled} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: theme.spacing.sm,
        borderWidth: 2,
        borderColor: theme.colors.disabled, // Gray border for section header avatar
    },
    title: {
        ...typography.h3,
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        color: theme.colors.text, // Black text for section header
        textTransform: 'uppercase',
    },
    menuButton: {
        padding: 4,
    },
});
