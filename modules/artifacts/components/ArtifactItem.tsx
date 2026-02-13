import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTheme, type Theme } from "@/ui/theme";
import { ArtifactResponse } from "../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ArtifactItemProps {
  artifact: ArtifactResponse;
}

export const ArtifactItem = ({ artifact }: ArtifactItemProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const formattedSize = useMemo(() => {
    const units = ["B", "KB", "MB", "GB"];
    let size = artifact.file_size;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)}${units[unitIndex]}`;
  }, [artifact.file_size]);

  const handleDownload = () => {
    Linking.openURL(artifact.file_url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleDownload}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconBackground}>
          <MaterialCommunityIcons name="android" size={20} color="#3DDC84" />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.abiLabel}>{artifact.abi || "Universal"}</Text>
          <Text style={styles.metaText}>
            {formattedSize} • {artifact.sha256.substring(0, 6)}
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name="cloud-download-outline"
        size={20}
        color={theme.colors.textLight}
      />
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
    },
    leftContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconBackground: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(61, 220, 132, 0.12)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.sm,
    },
    detailsContainer: {
      flex: 1,
    },
    abiLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 2,
    },
    metaText: {
      fontSize: 11,
      color: theme.colors.textLight,
      opacity: 0.8,
    },
  });
