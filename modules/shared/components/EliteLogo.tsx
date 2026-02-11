import { theme } from "@/ui/theme";
import { StyleSheet, Text, View } from "react-native";

export default function EliteLogo() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>AppShare</Text>
      <View style={styles.logoDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xl,
  },
  logo: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.textWhite,
    letterSpacing: -2,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
    marginLeft: -8,
    marginTop: 8,
  },
});
