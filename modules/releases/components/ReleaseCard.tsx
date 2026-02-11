import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, type Theme } from "@/ui/theme";
import { ReleaseResponse } from "../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.envBadge, { backgroundColor: envColor }]}>
            <Text style={styles.envText}>
              {release.environment.toUpperCase()}
            </Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{release.title}</Text>
            <Text style={styles.version}>
              v{release.version_name} ({release.version_code})
            </Text>
          </View>
        </View>
        <Text style={styles.releaseNote} numberOfLines={2}>
          {release.release_note}
        </Text>
      </View>
      <View style={styles.actions}>
        {onPromote && release.environment !== "production" && (
          <TouchableOpacity
            onPress={() => onPromote(release)}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons
              name="rocket-launch"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => onEdit(release)}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(release.id)}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={theme.colors.error}
          />
        </TouchableOpacity>
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
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
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
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSize.base,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    version: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textLight,
      opacity: 0.7,
    },
    releaseNote: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textLight,
      lineHeight: 20,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },
  });
