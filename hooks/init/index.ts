import { useMe } from "@/modules/auth/hooks";
import { useAuthStore } from "@/store/auth";
import { useCallback, useEffect } from "react";
import { Logger } from "@/libs/log";
import { JSONService } from "@/libs/json";
import EnvService from "@/libs/env";
import { APIService } from "@/libs/api/client";

const logger = new Logger("ApplicationStartup");

export default function useInitApp() {
  const {
    isAuthenticated,
    setUser,
    logout,
    isVerifyingAuth,
    setIsVerifyingAuth,
  } = useAuthStore();
  const { callMe, isLoading: isCallMeLoading } = useMe({});

  const initApplication = useCallback(async () => {
    logger.debug("Initializing application");

    // Initialize and validate environment variables first
    try {
      EnvService.init();
      logger.debug("✅ Environment variables validated successfully");
    } catch (error) {
      logger.error(`Failed to initialize environment variables: ${error}`);
      throw error; // Fail fast if env vars are missing
    }

    // Initialize API client
    APIService.initializeDefaultClient(EnvService.API_URL);

    // Set up logout handler for token refresh failures
    APIService.setLogoutHandler(() => {
      logger.debug("Token refresh failed, logging out user");
      logout();
    });

    // Initialize other services if needed
    // await PushNotificationService.init();
    // await GetPusher();

    setIsVerifyingAuth(true);

    const response = await callMe();

    if (response === null) {
      logger.debug("User not authenticated");
      setIsVerifyingAuth(false);
      return;
    }

    // The /auth/me endpoint returns the user directly in data
    const user = response.data;

    setUser(user);
    setIsVerifyingAuth(false);
    logger.debug(`User authenticated: ${JSONService.stringify(user)}`);
  }, [callMe, setIsVerifyingAuth, setUser, logout]);

  const isLoading = isCallMeLoading || isVerifyingAuth;

  useEffect(() => {
    initApplication();
  }, []);

  return {
    isLoading,
    isAuthenticated,
  };
}
