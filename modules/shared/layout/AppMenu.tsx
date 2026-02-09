import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { BottomSheetMenu } from "@/modules/shared/components/views/BottomSheetMenu";
import { useAuthStore } from "@/store/auth";
import { SecureStorage } from "@/libs/secure-storage";
import { SecureStorageKey } from "@/libs/secure-storage/keys";
import { useRouter } from "expo-router";

export interface AppMenuRef {
  open: () => void;
  close: () => void;
}

export const AppMenu = forwardRef<AppMenuRef>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const handleLogout = useCallback(async () => {
    await SecureStorage.removeItem(SecureStorageKey.BEARER_TOKEN);
    logout();
    router.replace("/(auth)/auth");
  }, [logout, router]);

  const menuItems = useMemo(() => {
    const commonItems = [
      {
        label: "Modifier Photo de profil",
        icon: "camera-outline" as const,
        onPress: () => console.log("Photo"),
      },
      {
        label: "Modifier Mot de Passe",
        icon: "lock-closed-outline" as const,
        onPress: () => console.log("Password"),
      },
    ];

    const logoutItem = {
      label: "Deconnexion",
      icon: "log-out-outline" as const,
      isHighlight: true,
      onPress: handleLogout,
    };

    return [...commonItems, logoutItem];
  }, [handleLogout]);

  return (
    <BottomSheetMenu
      visible={visible}
      onClose={() => setVisible(false)}
      items={menuItems}
    />
  );
});

AppMenu.displayName = "AppMenu";
