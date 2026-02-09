import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { Button } from '@/ui/use-cases/shared/components/inputs/Button';

interface JobSearchFormProps {
    value: string;
    onChangeText: (text: string) => void;
    onSearch: () => void;
    onFilterPress?: () => void;
}

export const JobSearchForm = ({
    value,
    onChangeText,
    onSearch,
    onFilterPress
}: JobSearchFormProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <MaterialCommunityIcons name="briefcase-outline" size={16} color="#fff" />
                <Text style={styles.labelText}>Emploi recherché</Text>
            </View>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Intitulé du poste, mots-clés , entreprise"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                />
                <TouchableOpacity style={styles.typeButton} onPress={onFilterPress}>
                    <Text style={styles.typeButtonText}>CDI</Text>
                    <Ionicons name="caret-down" size={12} color="#fff" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
            </View>

            <Button
                title="Rechercher"
                onPress={onSearch}
                style={styles.searchButton}
                textStyle={{ fontWeight: 'bold' }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.xl,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    labelText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        height: 44,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: theme.spacing.sm,
        fontSize: 12,
        color: '#000',
        marginRight: theme.spacing.sm,
        borderRadius: 2,
    },
    typeButton: {
        backgroundColor: theme.colors.accent, // Orange
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        justifyContent: 'center',
        borderRadius: 2,
        minWidth: 80,
    },
    typeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: theme.fontSize.base,
    },
    searchButton: {
        backgroundColor: '#00AEEF', // Blue
        width: '100%',
        borderRadius: theme.borderRadius.sm,
        height: 44,
    },
});
