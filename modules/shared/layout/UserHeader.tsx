import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { StaticAvatar } from "@/modules/shared/components/StaticAvatar";
import { useAuthStore } from "@/store/auth";
import { theme, typography } from "@/ui/theme";

interface UserHeaderProps {
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
}

const UserHeader = ({ onNotificationPress, onMenuPress }: UserHeaderProps) => {
  const { user } = useAuthStore();
  const username = `${user?.first_name} ${user?.last_name}`;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <StaticAvatar size={40} source={undefined} style={styles.avatar} />
        <Text style={styles.title}>{username}</Text>
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

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
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
