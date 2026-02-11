import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "@/ui/theme";
import { UserRole } from "@/modules/shared";

interface RolePickerProps {
  name: string;
  value: UserRole;
  onValueChange: (value: UserRole) => void;
  disabled?: boolean;
  error?: string;
}

export const RolePicker = React.memo<RolePickerProps>(
  ({ value, onValueChange, disabled, error }) => (
    <View style={styles.container}>
      <View style={[styles.pickerContainer, error && styles.pickerError]}>
        <Picker
          selectedValue={value}
          onValueChange={(role) => {
            onValueChange(role);
          }}
          style={styles.picker}
          enabled={!disabled}
          accessibilityLabel="Select role"
        >
          <Picker.Item label="Sélectionner un rôle" value={"client"} />
          <Picker.Item label="Livreur" value={"delivery_man"} />
          <Picker.Item label="Boutique" value={"seller"} />
          <Picker.Item label="Client" value={"client"} />
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  ),
);

RolePicker.displayName = "RolePicker";

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  pickerContainer: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
    height: 48,
    justifyContent: "center",
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
