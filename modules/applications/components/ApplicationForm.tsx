import React, { useEffect, useMemo } from "react";
import { z } from "zod";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGenericUpload } from "@/modules/upload/hooks";
import {
  CreateApplicationParams,
  CreateApplicationFromBinaryParams,
  ApplicationResponse,
} from "../types";

interface ApplicationFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateApplicationParams | CreateApplicationFromBinaryParams,
  ) => void;
  initialData?: ApplicationResponse | null;
  isLoading?: boolean;
  projectId: string;
}

const ApplicationFormDataSchema = z.object({
  project_id: z.uuid(),
  title: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(100),
  description: z.string().optional(),
  artifact_url: z.url().optional().or(z.literal("")),
});

type ApplicationFormData = z.infer<typeof ApplicationFormDataSchema>;

export const ApplicationForm = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  projectId,
}: ApplicationFormProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(ApplicationFormDataSchema),
    defaultValues: {
      project_id: projectId,
      title: "",
      description: "",
      artifact_url: "",
    },
  });

  const { upload, isUploading, progress } = useGenericUpload();
  const artifactUrl = watch("artifact_url");
  const [selectedFile, setSelectedFile] =
    React.useState<DocumentPicker.DocumentPickerAsset | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedFile(null);
      if (initialData) {
        reset({
          project_id: projectId,
          title: initialData.title,
          description: initialData.description,
          artifact_url: "",
        });
      } else {
        reset({
          project_id: projectId,
          title: "",
          description: "",
          artifact_url: "",
        });
      }
    }
  }, [visible, initialData, reset, projectId]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.android.package-archive",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);

        try {
          const uploadResult = await upload(file, [
            "application/vnd.android.package-archive",
          ]);
          if (uploadResult?.file_url) {
            setValue("artifact_url", uploadResult.file_url);
          }
        } catch (err) {
          console.error("Upload failed", err);
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const onFormSubmit = (data: ApplicationFormData) => {
    if (initialData) {
      // Update flow
      onSubmit({
        ...data,
        id: initialData.id,
      } as any); // The parent handles the update logic
    } else {
      // Create flow - must have artifact_url
      if (!data.artifact_url) return;

      onSubmit({
        project_id: data.project_id,
        title: data.title,
        artifact_url: data.artifact_url,
      });
    }
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
                    {initialData
                      ? "Modifier l'Application"
                      : "Nouvelle Application"}
                  </Text>
                  <TouchableOpacity onPress={onClose} disabled={isLoading}>
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
                            name={artifactUrl ? "check-circle" : "file-upload"}
                            size={24}
                            color={
                              artifactUrl ? "#4CAF50" : theme.colors.primary
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
                              onPress={() => {
                                setSelectedFile(null);
                                setValue("artifact_url", "");
                              }}
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
                            Le backend extraira le package name automatiquement.
                          </Text>
                        )}
                        {isUploading && (
                          <Text style={styles.uploadStatus}>
                            Upload en cours...{" "}
                            {Math.round((progress?.progress || 0) * 100)}%
                          </Text>
                        )}
                      </View>
                    )}

                    <Controller
                      control={control}
                      name="title"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="Titre"
                          placeholder="Nom de l'application"
                          value={value}
                          onChangeText={onChange}
                          error={errors.title?.message}
                          disabled={isLoading}
                        />
                      )}
                    />

                    {!!initialData && (
                      <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label="Description"
                            placeholder="Description de l'application"
                            value={value || ""}
                            onChangeText={onChange}
                            error={errors.description?.message}
                            multiline
                            numberOfLines={4}
                            style={styles.textArea}
                            disabled={!!isLoading}
                          />
                        )}
                      />
                    )}

                    <Button
                      title={initialData ? "Mettre à jour" : "Créer"}
                      onPress={handleSubmit(onFormSubmit)}
                      isLoading={!!isLoading || isUploading}
                      disabled={
                        (!initialData && !selectedFile) ||
                        (isUploading && !!progress && progress.progress < 1) ||
                        (!initialData && !artifactUrl)
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
      maxHeight: 600,
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
    label: {
      fontSize: theme.fontSize.sm,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
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
