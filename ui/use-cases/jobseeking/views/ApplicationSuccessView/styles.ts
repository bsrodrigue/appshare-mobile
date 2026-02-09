import { StyleSheet } from "react-native";
import { theme } from "@/ui/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    companyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.sm,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: theme.spacing.md,
    },
    companyName: {
        color: theme.colors.accent, // Orange
        fontSize: 24,
        fontWeight: 'bold',
    },
    jobTitle: {
        color: '#00AEEF', // Blue
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xl,
        gap: theme.spacing.lg,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#ccc',
        fontSize: 12,
        marginLeft: 4,
    },
    successCard: {
        backgroundColor: '#666', // Gray background
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    successText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#00AEEF', // Blue
        width: '80%',
        borderRadius: theme.borderRadius.md,
        paddingVertical: 12,
    },
});