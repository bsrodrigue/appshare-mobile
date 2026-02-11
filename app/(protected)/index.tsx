import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/ui/theme";
import { Button } from "@/modules/shared/components/Button";
import { useAuthStore } from "@/store/auth";

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.first_name}!</Text>
      <Text style={styles.subtitle}>You are successfully logged in.</Text>

      <Button title="Logout" onPress={logout} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xl,
  },
  button: {
    width: "100%",
  },
});
