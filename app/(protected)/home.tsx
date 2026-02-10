import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProjectsScreen from "@/modules/projects/screens/ProjectsScreen";

export default function HomeRoute() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ProjectsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
