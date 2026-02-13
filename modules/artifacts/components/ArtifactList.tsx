import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/ui/theme";
import { ArtifactResponse } from "../types";
import { useListArtifacts, useArtifactUpload } from "../hooks";
import { ArtifactItem } from "./ArtifactItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Toaster } from "@/libs/notification/toast";

interface ArtifactListProps {
  releaseId: string;
}

export const ArtifactList = ({ releaseId }: ArtifactListProps) => {
  const theme = useTheme();
  const [artifacts, setArtifacts] = useState<ArtifactResponse[]>([]);

  const { callListArtifacts, isLoading } = useListArtifacts({
    onSuccess: (data) => setArtifacts(data),
  });

  const { upload, isUploading } = useArtifactUpload();

  const handleAddArtifact = async () => {
    try {
      const result = await upload(releaseId);
      if (result) {
        Toaster.success("Succès", "Artéfact ajouté et rattaché à la release.");
        callListArtifacts(releaseId); // Refresh list
      }
    } catch (err: any) {
      if (!err.message?.includes("annulé")) {
        Toaster.error(
          "Erreur",
          err.message || "Impossible d'ajouter l'artéfact",
        );
      }
    }
  };

  useEffect(() => {
    if (releaseId) {
      callListArtifacts(releaseId);
    }
  }, [releaseId, callListArtifacts]);

  if (isLoading && artifacts.length === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Artifacts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddArtifact}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="plus"
                size={14}
                color={theme.colors.primary}
              />
              <Text style={styles.addButtonText}>Ajouter</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      {artifacts.map((artifact: ArtifactResponse) => (
        <ArtifactItem key={artifact.id} artifact={artifact} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 191, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#00bfff",
    marginLeft: 2,
  },
  loading: {
    padding: 16,
    alignItems: "center",
  },
});
