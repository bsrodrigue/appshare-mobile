import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '@/ui/theme';
import { Ionicons } from '@expo/vector-icons';

interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

export const FiltersModal = ({ visible, onClose, onApply }: FiltersModalProps) => {
    const [priceRange, setPriceRange] = useState<string | null>(null);
    const [availability, setAvailability] = useState<boolean>(true);

    const priceOptions = [
        { label: 'Tous les prix', value: null },
        { label: '< 5.000 FCFA', value: 'below_5k' },
        { label: '5.000 - 20.000 FCFA', value: '5k_20k' },
        { label: '> 20.000 FCFA', value: 'above_20k' },
    ];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filtres</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={styles.sectionTitle}>Plage de prix</Text>
                        <View style={styles.optionsContainer}>
                            {priceOptions.map((opt) => (
                                <TouchableOpacity
                                    key={opt.label}
                                    style={[styles.option, priceRange === opt.value && styles.activeOption]}
                                    onPress={() => setPriceRange(opt.value)}
                                >
                                    <Text style={[styles.optionText, priceRange === opt.value && styles.activeOptionText]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Disponibilité</Text>
                        <TouchableOpacity
                            style={styles.switchRow}
                            onPress={() => setAvailability(!availability)}
                        >
                            <Text style={styles.optionText}>En stock uniquement</Text>
                            <Ionicons
                                name={availability ? 'checkbox' : 'square-outline'}
                                size={24}
                                color={theme.colors.accent}
                            />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Vendeur</Text>
                        <Text style={styles.hint}>Filtrer par type de vendeur ou certification</Text>
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.option}>
                                <Text style={styles.optionText}>Vendeurs certifiés</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.resetBtn}
                            onPress={() => {
                                setPriceRange(null);
                                setAvailability(true);
                            }}
                        >
                            <Text style={styles.resetText}>Réinitialiser</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => {
                                onApply({ priceRange, availability });
                                onClose();
                            }}
                        >
                            <Text style={styles.applyText}>Appliquer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#1a1d2e',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    option: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeOption: {
        borderColor: theme.colors.accent,
        backgroundColor: 'rgba(0,191,255,0.1)',
    },
    optionText: {
        color: '#fff',
        fontSize: 14,
    },
    activeOptionText: {
        color: theme.colors.accent,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 20,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hint: {
        color: '#666',
        fontSize: 12,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    resetBtn: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    resetText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    applyBtn: {
        flex: 2,
        height: 50,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    applyText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
