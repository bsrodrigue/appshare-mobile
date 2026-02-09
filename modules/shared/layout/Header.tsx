import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { theme, typography } from "@/ui/theme";
import { StaticAvatar } from "@/modules/shared/components/StaticAvatar";

interface HeaderProps {
  title: string;
  avatarUrl?: string;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
}

export const Header = ({
  title,
  avatarUrl,
  onNotificationPress,
  onMenuPress,
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <StaticAvatar
          size={40}
          source={avatarUrl ? { uri: avatarUrl } : undefined}
          style={styles.avatar}
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconButton}
        >
          <Ionicons
            name="notifications"
            size={24}
            color={theme.colors.accent}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={theme.colors.textWhite}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing.sm,
    borderWidth: 2, // Smaller border for header avatar
  },
  title: {
    ...typography.h3,
    fontSize: theme.fontSize.base,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: theme.spacing.md,
    padding: 4,
  },
});
