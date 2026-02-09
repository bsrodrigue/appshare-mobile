import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { theme } from '@/ui/theme';

export type VehicleType = 'moto' | 'velo' | 'voiture';

interface VehicleTypePickerProps {
    name: string;
    value: VehicleType | undefined;
    onValueChange: (value: VehicleType | undefined) => void;
    disabled?: boolean;
    error?: string;
}

export const VehicleTypePicker = React.memo<VehicleTypePickerProps>(
    ({ value, onValueChange, disabled, error }) => (
        <View style={styles.container}>
            <View style={[styles.pickerContainer, error && styles.pickerError]}>
                <Picker
                    selectedValue={value || ''}
                    onValueChange={(vehicleType) => {
                        onValueChange(vehicleType as VehicleType || undefined);
                    }}
                    style={styles.picker}
                    enabled={!disabled}
                    accessibilityLabel="Select vehicle type"
                >
                    <Picker.Item label="Type de véhicule" value="" />
                    <Picker.Item label="Moto" value="moto" />
                    <Picker.Item label="Vélo" value="velo" />
                    <Picker.Item label="Voiture" value="voiture" />
                </Picker>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
);

VehicleTypePicker.displayName = 'VehicleTypePicker';

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    pickerContainer: {
        backgroundColor: theme.colors.inputBackground,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: 'transparent',
        overflow: 'hidden',
        height: 48,
        justifyContent: 'center',
    },
    pickerError: {
        borderColor: theme.colors.error,
    },
    picker: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: theme.fontSize.xs,
        marginTop: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
    },
});
