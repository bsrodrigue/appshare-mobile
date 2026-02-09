import { Stack } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function ProtectedRootLayout() {
  const { user } = useAuthStore();
  const role = user?.role;

  if (!role) {
    return <></>;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Admin Screens */}
      <Stack.Protected guard={role === "admin"}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>

      {/* Client Screens */}
      <Stack.Protected guard={role === "client"}>
        <Stack.Screen name="(client)" />
      </Stack.Protected>

      {/* Delivery Man Screens */}
      <Stack.Protected guard={role === "delivery_man"}>
        <Stack.Screen name="(delivery_man)" />
      </Stack.Protected>

      {/* Job Publisher Screens */}
      <Stack.Protected guard={role === "job_publisher"}>
        <Stack.Screen name="(job_publisher)" />
      </Stack.Protected>

      {/* Seller Screens */}
      <Stack.Protected guard={role === "seller"}>
        <Stack.Screen name="(seller)" />
      </Stack.Protected>
    </Stack>
  );
}
