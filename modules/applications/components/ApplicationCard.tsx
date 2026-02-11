import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, type Theme } from "@/ui/theme";
import { ApplicationResponse } from "../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ApplicationCardProps {
  application: ApplicationResponse;
  onEdit: (application: ApplicationResponse) => void;
  onDelete: (id: string) => void;
  onPress?: (application: ApplicationResponse) => void;
}

export const ApplicationCard = ({
  application,
  onEdit,
  onDelete,
  onPress,
}: ApplicationCardProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(application)}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="cellphone-cog"
            size={24}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{application.title}</Text>
            <Text style={styles.packageName}>{application.package_name}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {application.description}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(application)}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(application.id)}
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
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSize.base,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    packageName: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textLight,
      opacity: 0.7,
    },
    description: {
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
