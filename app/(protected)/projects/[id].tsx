import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useTheme, type Theme } from "@/ui/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toaster } from "@/libs/notification/toast";

import {
  useListApplications,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "@/modules/applications/hooks";
import { ApplicationCard } from "@/modules/applications/components/ApplicationCard";
import { ApplicationForm } from "@/modules/applications/components/ApplicationForm";
import {
  ApplicationResponse,
  CreateApplicationParams,
} from "@/modules/applications/types";
import { Button } from "@/modules/shared/components/Button";

export default function ProjectDetailScreen() {
  const { id: projectId, title: projectTitle } = useLocalSearchParams<{
    id: string;
    title: string;
  }>();
  const theme = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationResponse | null>(
    null,
  );
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);

  const { callListApplications, isLoading: isFetching } = useListApplications({
    onSuccess: (data) => setApplications(data),
    onError: (err) => Toaster.error("Erreur", err),
  });

  const fetchApplications = useCallback(() => {
    if (projectId) {
      callListApplications({ project_id: projectId });
    }
  }, [projectId, callListApplications]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const { callCreateApplication, isLoading: isCreating } = useCreateApplication(
    {
      onSuccess: () => {
        Toaster.success("Succès", "Application créée avec succès");
        setIsFormVisible(false);
        fetchApplications();
      },
      onError: (err) => Toaster.error("Erreur", err),
    },
  );

  const { callUpdateApplication, isLoading: isUpdating } = useUpdateApplication(
    {
      onSuccess: () => {
        Toaster.success("Succès", "Application mise à jour avec succès");
        setIsFormVisible(false);
        setEditingApp(null);
        fetchApplications();
      },
      onError: (err) => Toaster.error("Erreur", err),
    },
  );

  const { callDeleteApplication } = useDeleteApplication({
    onSuccess: () => {
      Toaster.success("Succès", "Application supprimée");
      fetchApplications();
    },
    onError: (err) => Toaster.error("Erreur", err),
  });

  const handleSubmit = (data: CreateApplicationParams) => {
    if (editingApp) {
      callUpdateApplication({
        id: editingApp.id,
        title: data.title,
        description: data.description,
      });
    } else {
      callCreateApplication(data);
    }
  };

  const handleEdit = (app: ApplicationResponse) => {
    setEditingApp(app);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Supprimer l'application",
      "Êtes-vous sûr de vouloir supprimer cette application ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => callDeleteApplication({ id }),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: projectTitle || "Détails du projet",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{projectTitle || "Projet"}</Text>
          <Text style={styles.subtitle}>Liste des applications</Text>
        </View>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={fetchApplications}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !isFetching ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="cellphone-off"
                size={64}
                color={theme.colors.textLight}
              />
              <Text style={styles.emptyText}>Aucune application trouvée</Text>
              <Button
                title="Ajouter une application"
                onPress={() => setIsFormVisible(true)}
                style={styles.emptyButton}
              />
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingApp(null);
          setIsFormVisible(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={32} color="white" />
      </TouchableOpacity>

      <ApplicationForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingApp(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingApp}
        isLoading={isCreating || isUpdating}
        projectId={projectId as string}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      marginLeft: theme.spacing.md,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textLight,
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 100,
    },
    emptyContainer: {
      paddingTop: 100,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      color: theme.colors.textLight,
      marginTop: theme.spacing.md,
      fontSize: theme.fontSize.base,
    },
    emptyButton: {
      marginTop: theme.spacing.lg,
      width: "100%",
    },
    fab: {
      position: "absolute",
      right: theme.spacing.lg,
      bottom: theme.spacing.lg,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
