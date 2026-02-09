import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface ShopActionBarProps {
    hasLatitude: boolean;
    hasPhone: boolean;
    onDirections: () => void;
    onWhatsApp: () => void;
    onCall: () => void;
}

export const ShopActionBar = ({
    hasLatitude,
    hasPhone,
    onDirections,
    onWhatsApp,
    onCall,
}: ShopActionBarProps) => {
    return (
        <View style={styles.actionBar}>
            <TouchableOpacity
                style={[styles.actionItem, !hasLatitude && styles.actionDisabled]}
                onPress={onDirections}
                disabled={!hasLatitude}
            >
                <View style={styles.actionIconContainer}>
                    <Ionicons name="navigate" size={24} color={hasLatitude ? theme.colors.accent : theme.colors.disabled} />
                </View>
                <Text style={[styles.actionText, !hasLatitude && styles.actionTextDisabled]}>Itineraire</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionItem, !hasPhone && styles.actionDisabled]}
                onPress={onWhatsApp}
                disabled={!hasPhone}
            >
                <View style={[styles.actionIconContainer, styles.whatsappIcon]}>
                    <FontAwesome name="whatsapp" size={24} color="#fff" />
                </View>
                <Text style={[styles.actionText, !hasPhone && styles.actionTextDisabled]}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionItem, !hasPhone && styles.actionDisabled]}
                onPress={onCall}
                disabled={!hasPhone}
            >
                <View style={[styles.actionIconContainer, styles.callIcon]}>
                    <MaterialIcons name="phone-in-talk" size={24} color="#fff" />
                </View>
                <Text style={[styles.actionText, !hasPhone && styles.actionTextDisabled]}>Appeler</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    actionBar: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.md,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    actionItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    whatsappIcon: {
        backgroundColor: '#25D366',
    },
    callIcon: {
        backgroundColor: theme.colors.accent,
    },
    actionDisabled: {
        opacity: 0.5,
    },
    actionText: {
        color: theme.colors.textWhite,
        fontSize: 12,
        fontWeight: '600',
    },
    actionTextDisabled: {
        color: theme.colors.disabled,
    },
});
