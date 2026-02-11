import { useTheme, type Theme } from "@/ui/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EliteLogo() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>AppShare</Text>
      <View style={styles.logoDot} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.xl,
    },
    logo: {
      fontSize: theme.fontSize.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      letterSpacing: -2,
    },
    logoDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.accent,
      marginLeft: -4,
      marginTop: 8,
    },
  });
