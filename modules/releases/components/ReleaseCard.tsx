import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme, type Theme } from "@/ui/theme";
import { ReleaseResponse } from "../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ArtifactList } from "@/modules/artifacts";

interface ReleaseCardProps {
  release: ReleaseResponse;
  onEdit: (release: ReleaseResponse) => void;
  onDelete: (id: string) => void;
  onPromote?: (release: ReleaseResponse) => void;
  onPress?: (release: ReleaseResponse) => void;
}

export const ReleaseCard = ({
  release,
  onEdit,
  onDelete,
  onPromote,
  onPress,
}: ReleaseCardProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const envColor = useMemo(() => {
    switch (release.environment) {
      case "production":
        return "#4CAF50"; // Success Green
      case "staging":
        return theme.colors.accent; // Orange
      case "development":
        return theme.colors.primary; // Blue
      default:
        return theme.colors.textLight;
    }
  }, [release.environment, theme]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(release)}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.titleInfo}>
          <View style={[styles.envBadge, { backgroundColor: envColor }]}>
            <Text style={styles.envText}>
              {release.environment.toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.title}>{release.title}</Text>
            <Text style={styles.version}>
              v{release.version_name} ({release.version_code})
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            const options = ["Modifier", "Supprimer"];

            if (onPromote && release.environment !== "production") {
              const nextEnv =
                release.environment === "development"
                  ? "staging"
                  : "production";
              options.push(`Promouvoir vers ${nextEnv}`);
            }

            Alert.alert("Options de la release", undefined, [
              { text: "Modifier", onPress: () => onEdit(release) },
              {
                text: "Supprimer",
                onPress: () => onDelete(release.id),
                style: "destructive",
              },
              ...(onPromote && release.environment !== "production"
                ? [
                    {
                      text: `Promouvoir vers ${release.environment === "development" ? "staging" : "production"}`,
                      onPress: () => onPromote(release),
                    },
                  ]
                : []),
              { text: "Annuler", style: "cancel" },
            ]);
          }}
          style={styles.menuButton}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={22}
            color={theme.colors.textLight}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {release.release_note ? (
          <Text style={styles.releaseNote} numberOfLines={3}>
            {release.release_note}
          </Text>
        ) : null}
        <ArtifactList releaseId={release.id} />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    titleInfo: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
    },
    envBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.xl,
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    envText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    title: {
      fontSize: theme.fontSize.base,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 2,
    },
    version: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textLight,
      opacity: 0.7,
    },
    content: {
      gap: theme.spacing.sm,
    },
    releaseNote: {
      fontSize: 13,
      color: theme.colors.textLight,
      lineHeight: 18,
      fontStyle: "italic",
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: -theme.spacing.xs,
    },
    menuButton: {
      padding: theme.spacing.xs,
      marginRight: -theme.spacing.sm,
    },
  });
