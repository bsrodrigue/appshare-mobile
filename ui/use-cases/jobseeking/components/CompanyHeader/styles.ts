import { StyleSheet } from 'react-native';
import { theme } from '@/ui/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing.md,
        paddingBottom: 80,
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
    formContainer: {
        marginBottom: theme.spacing.xl,
    },
    emailRow: {
        flexDirection: 'row',
        height: 40,
        marginBottom: theme.spacing.md,
    },
    emailIconContainer: {
        width: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 2,
    },
    emailLabelContainer: {
        backgroundColor: theme.colors.accent, // Orange
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.md,
        marginRight: 2,
    },
    emailLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    emailInputContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    input: {
        backgroundColor: '#fff',
        height: 40,
        paddingHorizontal: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        fontSize: 12,
        color: '#000',
    },
    textArea: {
        height: 150,
        paddingVertical: theme.spacing.sm,
    },
    cvButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.sm,
        height: 40,
        width: 120, // Small width as per screenshot
    },
    cvButtonText: {
        color: '#999',
        fontSize: 12,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.lg,
    },
    applyButton: {
        backgroundColor: '#00AEEF', // Blue
        width: '80%',
        borderRadius: theme.borderRadius.md,
        paddingVertical: 12,
    },
});