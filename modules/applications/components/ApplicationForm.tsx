import React, { useEffect, useMemo } from "react";
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
import {
  CreateApplicationParams,
  CreateApplicationParamsSchema,
  ApplicationResponse,
} from "../types";

interface ApplicationFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApplicationParams) => void;
  initialData?: ApplicationResponse | null;
  isLoading?: boolean;
  projectId: string;
}

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
  } = useForm<CreateApplicationParams>({
    resolver: zodResolver(CreateApplicationParamsSchema),
    defaultValues: {
      project_id: projectId,
      title: "",
      package_name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (visible) {
      if (initialData) {
        reset({
          project_id: projectId,
          title: initialData.title,
          package_name: initialData.package_name,
          description: initialData.description,
        });
      } else {
        reset({
          project_id: projectId,
          title: "",
          package_name: "",
          description: "",
        });
      }
    }
  }, [visible, initialData, reset, projectId]);

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

                    <Controller
                      control={control}
                      name="package_name"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="Nom de package (ID)"
                          placeholder="com.exemple.app"
                          value={value}
                          onChangeText={onChange}
                          error={errors.package_name?.message}
                          disabled={isLoading || !!initialData}
                          autoCapitalize="none"
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="description"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          label="Description"
                          placeholder="Description de l'application"
                          value={value}
                          onChangeText={onChange}
                          error={errors.description?.message}
                          multiline
                          numberOfLines={4}
                          style={styles.textArea}
                          disabled={isLoading}
                        />
                      )}
                    />

                    <Button
                      title={initialData ? "Mettre à jour" : "Créer"}
                      onPress={handleSubmit(onSubmit)}
                      isLoading={isLoading}
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
  });
