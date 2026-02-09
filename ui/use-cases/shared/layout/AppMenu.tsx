import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { BottomSheetMenu } from "@/ui/use-cases/shared/views/BottomSheetMenu";
import { useAuthStore } from "@/store/auth";
import { SecureStorage } from "@/libs/secure-storage";
import { SecureStorageKey } from "@/libs/secure-storage/keys";
import { useRouter } from "expo-router";
import { useUpdateAvailability } from "@/features/delivery-man/hooks";
import { Toaster } from "@/libs/notification/toast";

export interface AppMenuRef {
  open: () => void;
  close: () => void;
}

export const AppMenu = forwardRef<AppMenuRef>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const router = useRouter();

  const { updateAvailability } = useUpdateAvailability({
    onSuccess(response) {
      Toaster.success("Disponibilité mise à jour", response.message);
    },

    onError(error) {
      Toaster.error("Erreur", error);
    },
  });

  const handleUpdateAvailability = useCallback(async () => {
    await updateAvailability({
      availability: "available",
    });
  }, [updateAvailability]);

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

    switch (role) {
      case "client":
        return [
          ...commonItems,
          {
            label: "Historique des commandes",
            icon: "list-outline" as const,
            onPress: () => console.log("Orders"),
          },
          logoutItem,
        ];
      case "seller":
        return [
          ...commonItems,
          {
            label: "Modifier la boutique",
            icon: "business-outline" as const,
            onPress: () => console.log("Shop"),
          },
          {
            label: "Statistiques de vente",
            icon: "bar-chart-outline" as const,
            onPress: () => console.log("Stats"),
          },
          logoutItem,
        ];
      case "delivery_man":
        return [
          ...commonItems,
          {
            label: "Activer/Desactiver Disponibilité",
            icon: "checkmark-circle-outline" as const,
            onPress: () => {
              handleUpdateAvailability();
            },
          },
          logoutItem,
        ];
      default:
        return [logoutItem];
    }
  }, [handleLogout, role, handleUpdateAvailability]);

  return (
    <BottomSheetMenu
      visible={visible}
      onClose={() => setVisible(false)}
      items={menuItems}
    />
  );
});

AppMenu.displayName = "AppMenu";
