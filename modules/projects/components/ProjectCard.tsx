import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, type Theme } from "@/ui/theme";
import { ProjectResponse } from "../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ProjectCardProps {
  project: ProjectResponse;
  onEdit: (project: ProjectResponse) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
        <Text style={styles.date}>
          {new Date(project.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(project)}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(project.id)}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      </View>
    </View>
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
    title: {
      fontSize: theme.fontSize.base,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    description: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textLight,
      marginBottom: theme.spacing.sm,
    },
    date: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textLight,
      opacity: 0.6,
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
