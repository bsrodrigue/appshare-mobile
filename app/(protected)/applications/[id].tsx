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
  useListReleases,
  useCreateRelease,
  useUpdateRelease,
  useDeleteRelease,
  usePromoteRelease,
} from "@/modules/releases/hooks";
import { ReleaseCard, ReleaseForm } from "@/modules/releases";
import { ReleaseResponse, CreateReleaseInput } from "@/modules/releases/types";
import { useGetApplication } from "@/modules/applications/hooks";
import { ApplicationResponse } from "@/modules/applications/types";
import { Button } from "@/modules/shared/components/Button";

export default function ApplicationDetailScreen() {
  const { id: appId, title: initialTitle } = useLocalSearchParams<{
    id: string;
    title: string;
  }>();
  const theme = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRelease, setEditingRelease] = useState<ReleaseResponse | null>(
    null,
  );
  const [releases, setReleases] = useState<ReleaseResponse[]>([]);
  const [application, setApplication] = useState<ApplicationResponse | null>(
    null,
  );

  // Fetch Application Details
  const { callGetApplication } = useGetApplication({
    onSuccess: (data) => setApplication(data),
    onError: (err) =>
      Toaster.error("Erreur", "Impossible de charger l'application"),
  });

  // List Releases
  const { callListReleases, isLoading: isFetching } = useListReleases({
    onSuccess: (data) => setReleases(data),
    onError: (err) => Toaster.error("Erreur", err),
  });

  const fetchData = useCallback(() => {
    if (appId) {
      callGetApplication({ id: appId });
      callListReleases({ app_id: appId });
    }
  }, [appId, callGetApplication, callListReleases]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create Release
  const { callCreateRelease, isLoading: isCreating } = useCreateRelease({
    onSuccess: () => {
      Toaster.success("Succès", "Release créée avec succès");
      setIsFormVisible(false);
      fetchData();
    },
    onError: (err) => Toaster.error("Erreur", err),
  });

  // Update Release
  const { callUpdateRelease, isLoading: isUpdating } = useUpdateRelease({
    onSuccess: () => {
      Toaster.success("Succès", "Release mise à jour");
      setIsFormVisible(false);
      setEditingRelease(null);
      fetchData();
    },
    onError: (err) => Toaster.error("Erreur", err),
  });

  // Delete Release
  const { callDeleteRelease } = useDeleteRelease({
    onSuccess: () => {
      Toaster.success("Succès", "Release supprimée");
      fetchData();
    },
    onError: (err) => Toaster.error("Erreur", err),
  });

  // Promote Release
  const { callPromoteRelease } = usePromoteRelease({
    onSuccess: () => {
      Toaster.success("Succès", "Release promue avec succès");
      fetchData();
    },
    onError: (err) => Toaster.error("Erreur", err),
  });

  const handleSubmit = (data: CreateReleaseInput) => {
    if (editingRelease) {
      callUpdateRelease({
        id: editingRelease.id,
        body: {
          title: data.title,
          release_note: data.release_note,
        },
      });
    } else {
      callCreateRelease({
        app_id: appId as string,
        body: data,
      });
    }
  };

  const handleEdit = (release: ReleaseResponse) => {
    setEditingRelease(release);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Supprimer la release",
      "Êtes-vous sûr de vouloir supprimer cette release ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => callDeleteRelease({ id }),
        },
      ],
    );
  };

  const handlePromote = (release: ReleaseResponse) => {
    const nextEnv =
      release.environment === "development" ? "staging" : "production";
    Alert.alert(
      "Promouvoir la release",
      `Voulez-vous promouvoir cette release vers l'environnement ${nextEnv} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Promouvoir",
          onPress: () =>
            callPromoteRelease({
              id: release.id,
              body: { environment: nextEnv },
            }),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: application?.title || initialTitle || "Détails de l'app",
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
          <Text style={styles.title}>
            {application?.title || initialTitle || "Application"}
          </Text>
          <Text style={styles.subtitle}>Releases & Versions</Text>
        </View>
      </View>

      <FlatList
        data={releases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReleaseCard
            release={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPromote={handlePromote}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={fetchData}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !isFetching ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="rocket-launch-outline"
                size={64}
                color={theme.colors.textLight}
              />
              <Text style={styles.emptyText}>Aucune release trouvée</Text>
              <Button
                title="Créer la première release"
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
          setEditingRelease(null);
          setIsFormVisible(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={32} color="white" />
      </TouchableOpacity>

      <ReleaseForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingRelease(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingRelease}
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
