import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { DateTimeService } from '@/libs/datetime';

interface DatePickerProps {
    label?: string;
    value?: Date;
    onChange: (date: Date) => void;
    error?: string;
    minimumDate?: Date;
    maximumDate?: Date;
    disabled?: boolean;
    placeholder?: string;
}

export const DatePicker = ({
    label,
    value,
    onChange,
    error,
    minimumDate,
    maximumDate,
    disabled,
    placeholder = 'Select date',
}: DatePickerProps) => {
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(value || new Date());

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
            if (event.type === 'set' && selectedDate) {
                onChange(selectedDate);
            }
        } else {
            // iOS
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    const confirmIOS = () => {
        onChange(tempDate);
        setShow(false);
    };

    const cancelIOS = () => {
        setShow(false);
        setTempDate(value || new Date());
    };

    const openPicker = () => {
        if (disabled) return;
        setTempDate(value || new Date());
        setShow(true);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={[
                    styles.input,
                    error && styles.inputError,
                    disabled && styles.disabled,
                ]}
                onPress={openPicker}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <Text style={[styles.valueText, !value && styles.placeholderText]}>
                    {value ? DateTimeService.format(value, 'DD/MM/YYYY') : placeholder}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Android Picker */}
            {Platform.OS === 'android' && show && (
                <RNDateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                />
            )}

            {/* iOS Picker Modal */}
            {Platform.OS === 'ios' && (
                <Modal
                    transparent
                    visible={show}
                    animationType="fade"
                    onRequestClose={cancelIOS}
                >
                    <TouchableWithoutFeedback onPress={cancelIOS}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <TouchableOpacity onPress={cancelIOS} style={styles.modalButton}>
                                            <Text style={styles.cancelText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.modalTitle}>Select Date</Text>
                                        <TouchableOpacity onPress={confirmIOS} style={styles.modalButton}>
                                            <Text style={styles.confirmText}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <RNDateTimePicker
                                        value={tempDate}
                                        mode="date"
                                        display="spinner"
                                        onChange={handleChange}
                                        minimumDate={minimumDate}
                                        maximumDate={maximumDate}
                                        textColor="black"
                                        style={styles.picker}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.xs,
        fontWeight: '500',
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.inputBackground,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    disabled: {
        opacity: 0.5,
    },
    valueText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
    },
    placeholderText: {
        color: theme.colors.placeholder,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: theme.fontSize.xs,
        marginTop: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
    },
    // iOS Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
        paddingBottom: 20, // Safe area
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.inputBackground,
    },
    modalTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        color: 'black',
    },
    modalButton: {
        padding: theme.spacing.xs,
    },
    cancelText: {
        color: theme.colors.textLight,
        fontSize: theme.fontSize.md,
    },
    confirmText: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
    picker: {
        height: 200,
        width: '100%',
    },
});
