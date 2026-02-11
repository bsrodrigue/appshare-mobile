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
import { useTheme, type Theme } from "@/ui/theme";
import { Button } from "@/modules/shared/components/Button";
import { useAuthStore } from "@/store/auth";
import {
  useListProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/modules/projects/hooks";
import { ProjectCard } from "@/modules/projects/components/ProjectCard";
import { ProjectForm } from "@/modules/projects/components/ProjectForm";
import { ProjectResponse, CreateProjectParams } from "@/modules/projects/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Toaster } from "@/libs/notification/toast";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null,
  );

  const { callListProjects, isLoading: isFetching } = useListProjects();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  const fetchProjects = useCallback(async () => {
    const data = await callListProjects();
    if (data) {
      setProjects(data);
    }
  }, [callListProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const { callCreateProject, isLoading: isCreating } = useCreateProject({
    onSuccess: () => {
      Toaster.success("Succès", "Projet créé avec succès");
      setIsFormVisible(false);
      fetchProjects();
    },
  });

  const { callUpdateProject, isLoading: isUpdating } = useUpdateProject({
    onSuccess: () => {
      Toaster.success("Succès", "Projet mis à jour avec succès");
      setIsFormVisible(false);
      setEditingProject(null);
      fetchProjects();
    },
  });

  const { callDeleteProject } = useDeleteProject({
    onSuccess: () => {
      Toaster.success("Succès", "Projet supprimé");
      fetchProjects();
    },
  });

  const handleCreate = (data: CreateProjectParams) => {
    if (editingProject) {
      callUpdateProject({ id: editingProject.id, ...data });
    } else {
      callCreateProject(data);
    }
  };

  const handleEdit = (project: ProjectResponse) => {
    setEditingProject(project);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Supprimer le projet",
      "Êtes-vous sûr de vouloir supprimer ce projet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => callDeleteProject({ id }),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bonjour, {user?.first_name}!</Text>
          <Text style={styles.subtitle}>Gérez vos projets AppShare</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color={theme.colors.textLight}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={fetchProjects}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !isFetching ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="folder-open-outline"
                size={64}
                color={theme.colors.textLight}
              />
              <Text style={styles.emptyText}>Aucun projet pour le moment</Text>
              <Button
                title="Créer votre premier projet"
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
          setEditingProject(null);
          setIsFormVisible(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={32} color="white" />
      </TouchableOpacity>

      <ProjectForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreate}
        initialData={editingProject}
        isLoading={isCreating || isUpdating}
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    welcome: {
      fontSize: theme.fontSize.lg,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textLight,
    },
    logoutButton: {
      padding: theme.spacing.sm,
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
