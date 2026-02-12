import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme, type Theme } from "@/ui/theme";
import { Input } from "@/modules/shared/components/Input";
import { Button } from "@/modules/shared/components/Button";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  CreateReleaseInput,
  CreateReleaseInputSchema,
  ReleaseResponse,
} from "../types";

export interface ReleaseFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReleaseInput) => void;
  onFileSelected?: (file: DocumentPicker.DocumentPickerAsset) => void;
  initialData?: ReleaseResponse | null;
  isLoading?: boolean;
  isUploading?: boolean;
  uploadProgress?: number | null;
}

export const ReleaseForm = ({
  visible,
  onClose,
  onSubmit,
  onFileSelected,
  initialData,
  isLoading,
  isUploading,
  uploadProgress,
}: ReleaseFormProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReleaseInput>({
    resolver: zodResolver(CreateReleaseInputSchema),
    defaultValues: {
      release_note: "",
      environment: "development",
    },
  });

  useEffect(() => {
    if (visible) {
      setSelectedFile(null);
      if (initialData) {
        reset({
          release_note: initialData.release_note,
          environment: initialData.environment as
            | "development"
            | "staging"
            | "production",
        });
      } else {
        reset({
          release_note: "",
          environment: "development",
        });
      }
    }
  }, [visible, initialData, reset]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.android.package-archive",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        onFileSelected?.(file);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const onFormSubmit = (data: CreateReleaseInput) => {
    onSubmit(data);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      onDismiss={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoidingView}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {initialData ? "Modifier la Release" : "Nouvelle Release"}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    disabled={isLoading || isUploading}
                  >
                    <Text style={styles.closeText}>Annuler</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContent}
                >
                  <View style={styles.form}>
                    {!initialData && (
                      <View style={styles.filePickerSection}>
                        <Text style={styles.label}>Artifact (APK)</Text>
                        <TouchableOpacity
                          style={[
                            styles.filePickerContainer,
                            selectedFile && styles.filePickerContainerActive,
                          ]}
                          onPress={handlePickFile}
                          disabled={isLoading || isUploading}
                        >
                          <MaterialCommunityIcons
                            name={selectedFile ? "check-circle" : "file-upload"}
                            size={24}
                            color={
                              selectedFile ? "#4CAF50" : theme.colors.primary
                            }
                          />
                          <Text
                            style={[
                              styles.filePickerText,
                              selectedFile && styles.filePickerTextActive,
                            ]}
                            numberOfLines={1}
                          >
                            {selectedFile
                              ? selectedFile.name
                              : "Sélectionner un fichier APK"}
                          </Text>
                          {selectedFile && !isUploading && (
                            <TouchableOpacity
                              onPress={() => setSelectedFile(null)}
                              style={styles.clearFile}
                            >
                              <MaterialCommunityIcons
                                name="close-circle"
                                size={20}
                                color={theme.colors.textLight}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        {!selectedFile && (
                          <Text style={styles.fileHint}>
                            Le backend extraira le titre et la version
                            automatiquement.
                          </Text>
                        )}
                        {isUploading && (
                          <Text style={styles.uploadStatus}>
                            Upload en cours...{" "}
                            {Math.round((uploadProgress || 0) * 100)}%
                          </Text>
                        )}
                      </View>
                    )}

                    <View style={styles.pickerField}>
                      <Text style={styles.label}>Environnement</Text>
                      <View
                        style={[
                          styles.pickerContainer,
                          !!initialData && styles.disabledPicker,
                        ]}
                      >
                        <Controller
                          control={control}
                          name="environment"
                          render={({ field: { onChange, value } }) => (
                            <Picker
                              selectedValue={value}
                              onValueChange={onChange}
                              enabled={!isLoading && !initialData}
                              style={styles.picker}
                            >
                              <Picker.Item
                                label="Development"
                                value="development"
                              />
                              <Picker.Item label="Staging" value="staging" />
                              <Picker.Item
                                label="Production"
                                value="production"
                              />
                            </Picker>
                          )}
                        />
                      </View>
                      {errors.environment && (
                        <Text style={styles.errorText}>
                          {errors.environment.message}
                        </Text>
                      )}
                    </View>

                    <Controller
                      control={control}
                      name="release_note"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="Notes de version"
                          placeholder="Qu'est-ce qui a changé ?"
                          value={value}
                          onChangeText={onChange}
                          error={errors.release_note?.message}
                          multiline
                          numberOfLines={4}
                          style={styles.textArea}
                          disabled={isLoading}
                        />
                      )}
                    />

                    <Button
                      title={
                        initialData
                          ? "Mettre à jour"
                          : isUploading
                            ? "Upload en cours..."
                            : "Confirmer la Release"
                      }
                      onPress={handleSubmit(onFormSubmit)}
                      isLoading={isLoading}
                      disabled={
                        (!initialData && !selectedFile) ||
                        (isUploading && uploadProgress === 1)
                      }
                      style={styles.submitButton}
                    />
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (theme: Theme, insets: { bottom: number }) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "flex-end",
    },
    keyboardAvoidingView: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
    },
    modalContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
      maxHeight: 700,
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeText: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.base,
    },
    scrollContent: {
      flexGrow: 1,
    },
    form: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    submitButton: {
      marginTop: theme.spacing.md,
    },
    pickerField: {
      marginBottom: theme.spacing.xs,
    },
    label: {
      fontSize: theme.fontSize.sm,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
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
    disabledPicker: {
      opacity: 0.5,
    },
    picker: {
      color: theme.colors.text,
      fontSize: theme.fontSize.md,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.fontSize.xs,
      marginTop: theme.spacing.xs,
    },
    filePickerSection: {
      marginBottom: theme.spacing.sm,
    },
    filePickerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
      padding: theme.spacing.md,
    },
    filePickerContainerActive: {
      borderColor: "#4CAF50",
      borderStyle: "solid",
      backgroundColor: "rgba(76, 175, 80, 0.05)",
    },
    filePickerText: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      fontSize: theme.fontSize.sm,
      color: theme.colors.textLight,
    },
    filePickerTextActive: {
      color: theme.colors.text,
      fontWeight: "500",
    },
    fileHint: {
      fontSize: 10,
      color: theme.colors.textLight,
      marginTop: 4,
      fontStyle: "italic",
    },
    uploadStatus: {
      fontSize: 12,
      color: theme.colors.primary,
      marginTop: 8,
      fontWeight: "600",
    },
    clearFile: {
      padding: 4,
    },
  });
