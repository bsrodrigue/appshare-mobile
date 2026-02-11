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
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CreateReleaseInput,
  CreateReleaseInputSchema,
  ReleaseResponse,
} from "../types";

interface ReleaseFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReleaseInput) => void;
  initialData?: ReleaseResponse | null;
  isLoading?: boolean;
}

export const ReleaseForm = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: ReleaseFormProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReleaseInput>({
    resolver: zodResolver(CreateReleaseInputSchema),
    defaultValues: {
      title: "",
      version_code: 1,
      version_name: "",
      release_note: "",
      environment: "development",
    },
  });

  useEffect(() => {
    if (visible) {
      if (initialData) {
        reset({
          title: initialData.title,
          version_code: initialData.version_code,
          version_name: initialData.version_name,
          release_note: initialData.release_note,
          environment: initialData.environment,
        });
      } else {
        reset({
          title: "",
          version_code: 1,
          version_name: "",
          release_note: "",
          environment: "development",
        });
      }
    }
  }, [visible, initialData, reset]);

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
                          placeholder="Nom de la release (ex: Bug fixes)"
                          value={value}
                          onChangeText={onChange}
                          error={errors.title?.message}
                          disabled={isLoading}
                        />
                      )}
                    />

                    <View style={styles.row}>
                      <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                        <Controller
                          control={control}
                          name="version_name"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              label="Version Name"
                              placeholder="1.0.0"
                              value={value}
                              onChangeText={onChange}
                              error={errors.version_name?.message}
                              disabled={isLoading || !!initialData}
                              autoCapitalize="none"
                            />
                          )}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Controller
                          control={control}
                          name="version_code"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              label="Version Code"
                              placeholder="1"
                              value={value?.toString()}
                              onChangeText={(text) =>
                                onChange(parseInt(text, 10) || 0)
                              }
                              error={errors.version_code?.message}
                              disabled={isLoading || !!initialData}
                              keyboardType="numeric"
                            />
                          )}
                        />
                      </View>
                    </View>

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
    row: {
      flexDirection: "row",
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
  });
