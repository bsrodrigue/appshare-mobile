import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme } from "@/ui/theme";
import { Button } from "./inputs/Button";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  /** Enable text input field */
  showInput?: boolean;
  /** Placeholder for the text input */
  inputPlaceholder?: string;
  /** Whether the input is required before confirming */
  inputRequired?: boolean;
  /** Error message when input is required but empty */
  inputRequiredMessage?: string;
}

export const ConfirmationModal = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isDestructive = false,
  isLoading = false,
  showInput = false,
  inputPlaceholder = "",
  inputRequired = false,
  inputRequiredMessage = "Ce champ est requis",
}: ConfirmationModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  // Reset input state when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setInputValue("");
      setInputError("");
    }
  }, [visible]);

  const handleConfirm = () => {
    if (showInput && inputRequired && inputValue.trim() === "") {
      setInputError(inputRequiredMessage);
      return;
    }
    setInputError("");
    onConfirm(showInput ? inputValue.trim() : undefined);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (inputError) {
      setInputError("");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              {showInput && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      inputError ? styles.inputError : null,
                    ]}
                    placeholder={inputPlaceholder}
                    placeholderTextColor={theme.colors.textLight}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  {inputError ? (
                    <Text style={styles.errorText}>{inputError}</Text>
                  ) : null}
                </View>
              )}

              <View style={styles.actions}>
                <Button
                  title={cancelText}
                  variant="outline"
                  onPress={onCancel}
                  style={styles.button}
                  textStyle={{
                    fontSize: theme.fontSize.sm,
                  }}
                  disabled={isLoading}
                />
                <Button
                  title={confirmText}
                  onPress={handleConfirm}
                  style={[
                    styles.button,
                    isDestructive && { backgroundColor: theme.colors.error },
                  ]}
                  textStyle={{
                    fontSize: theme.fontSize.sm,
                  }}
                  isLoading={isLoading}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.sm,
    minHeight: 80,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    minWidth: 0,
    paddingVertical: theme.spacing.md,
  },
});
