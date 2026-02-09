import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppFonts } from "@/hooks/useAppFonts";
import Toast from "react-native-toast-message";
import useInitApp from "@/hooks/init";

export default function RootLayout() {
  const { appIsReady, onLayoutRootView } = useAppFonts();
  const { isLoading: isInitLoading, isAuthenticated } = useInitApp();

  const isLoading = !appIsReady || isInitLoading;

  if (isLoading) {
    return (
      <Stack>
        <Stack.Screen name="loading" />
      </Stack>
    );
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Private Screens */}
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(protected)" />
        </Stack.Protected>

        {/* Public Screens */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>

      <Toast />
    </SafeAreaProvider>
  );
}
