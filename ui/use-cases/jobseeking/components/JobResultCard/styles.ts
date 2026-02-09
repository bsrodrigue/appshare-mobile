import { StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    logoContainer: {
        width: 60,
        marginRight: theme.spacing.md,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        color: '#00AEEF', // Blue
        fontSize: theme.fontSize.base,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    company: {
        color: theme.colors.accent, // Orange
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#ccc',
        fontSize: 10,
        marginBottom: 6,
        lineHeight: 14,
    },
    boldLabel: {
        fontWeight: 'bold',
        color: '#fff',
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 6,
        gap: theme.spacing.md,
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#ccc',
        fontSize: 10,
        marginLeft: 4,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        flexWrap: 'wrap',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    timeText: {
        color: '#fff',
        fontSize: 9,
        marginLeft: 4,
    },
    applyBadge: {
        backgroundColor: '#00AEEF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    applyText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
});