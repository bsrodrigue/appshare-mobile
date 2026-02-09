import { useMe } from "@/modules/auth/hooks";
import { useAuthStore } from "@/store/auth";
import { useCallback, useEffect } from "react";
import { Logger } from "@/libs/log";
import { JSONService } from "@/libs/json";
import { GetPusher } from "@/libs/realtime/pusher";
import EnvService from "@/libs/env";
import { APIService } from "@/libs/api/client";
import PushNotificationService from "@/libs/push-notification/init";

export default function useInitApp() {
  const { isAuthenticated, setUser, isVerifyingAuth, setIsVerifyingAuth } =
    useAuthStore();
  const { callMe, isLoading: isCallMeLoading } = useMe({});

  const initApplication = useCallback(async () => {
    Logger.setModuleName("ApplicationStartup");
    Logger.debug("Initializing application");

    // Initialize and validate environment variables first
    try {
      EnvService.init();
      Logger.debug("✅ Environment variables validated successfully");
    } catch (error) {
      Logger.error(`Failed to initialize environment variables: ${error}`);
      throw error; // Fail fast if env vars are missing
    }

    // Initialize other services
    APIService.initializeDefaultClient(EnvService.API_URL);
    // await PushNotificationService.init();

    // await GetPusher();

    setIsVerifyingAuth(true);

    const response = await callMe();

    if (response === null) {
      Logger.debug("User not authenticated");
      setIsVerifyingAuth(false);

      return;
    }

    const { user } = response.data;

    setUser(user);
    setIsVerifyingAuth(false);
    Logger.debug(`User authenticated: ${JSONService.stringify(user)}`);
  }, [callMe, setIsVerifyingAuth, setUser]);

  const isLoading = isCallMeLoading || isVerifyingAuth;

  useEffect(() => {
    initApplication();
  }, []);

  return {
    isLoading,
    isAuthenticated,
  };
}
