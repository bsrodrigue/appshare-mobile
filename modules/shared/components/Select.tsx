import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    value: string;
    options: SelectOption[];
    onValueChange: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
}

export const Select = ({
    value,
    options,
    onValueChange,
    placeholder,
    disabled = false,
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <>
            <TouchableOpacity
                style={[styles.selectButton, disabled && styles.disabled]}
                onPress={() => !disabled && setIsOpen(true)}
                disabled={disabled}
            >
                <Text
                    style={[styles.selectText, !selectedOption && styles.placeholderText]}
                    numberOfLines={1}
                >
                    {displayText}
                </Text>
                <Ionicons name="caret-down" size={16} color="#000" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item.value === value && styles.selectedOption,
                                    ]}
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item.value === value && styles.selectedOptionText,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {item.value === value && (
                                        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: theme.spacing.sm,
        height: 40,
        backgroundColor: '#fff',
    },
    disabled: {
        opacity: 0.5,
    },
    selectText: {
        flex: 1,
        color: '#000',
        fontSize: 14,
    },
    placeholderText: {
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '80%',
        maxHeight: '60%',
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedOption: {
        backgroundColor: '#f0f8ff',
    },
    optionText: {
        fontSize: theme.fontSize.base,
        color: '#000',
    },
    selectedOptionText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
