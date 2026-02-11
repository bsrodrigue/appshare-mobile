import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Logger } from "@/libs/log";
import EnvService from "@/libs/env";
import { APIService } from "@/libs/api/client";
import { TokenService, TokenPair } from "@/libs/token";
import { me, refreshToken } from "@/modules/auth/api";

const logger = new Logger("ApplicationStartup");

/**
 * useInitApp handles the application's boot sequence.
 * 1. Validates environment variables.
 * 2. Initializes the singleton APIService.
 * 3. Injects token refresh and logout logic.
 * 4. Checks if the user is already authenticated by trying to fetch their profile.
 */
export default function useInitApp() {
  const {
    isAuthenticated,
    setUser,
    logout,
    isVerifyingAuth,
    setIsVerifyingAuth,
  } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  const initApplication = useCallback(async () => {
    logger.debug("Initializing application sequence...");

    // 1. Initialize environment variables
    try {
      logger.debug("Initializing environment variables...");
      EnvService.init();
      logger.debug("✅ Environment variables validated.");
    } catch (error) {
      logger.error(`Failed to initialize environment: ${error}`);
    }

    // 2. Initialize API Client
    APIService.initializeDefaultClient(EnvService.API_URL);

    // 3. Inject token refresh handler (avoids circular dependency in APIService)
    APIService.setTokenRefreshHandler(
      async (token: string): Promise<TokenPair | null> => {
        try {
          const response = await refreshToken({ refresh_token: token });
          const tokens: TokenPair = {
            accessToken: response.tokens.access_token,
            refreshToken: response.tokens.refresh_token,
            accessTokenExpiresAt: response.tokens.access_token_expires_at,
            refreshTokenExpiresAt: response.tokens.refresh_token_expires_at,
          };
          await TokenService.storeTokens(tokens);
          return tokens;
        } catch (error) {
          logger.error(`Background token refresh failed: ${error}`);
          return null;
        }
      },
    );

    // 4. Set up logout handler for session failure
    APIService.setLogoutHandler(() => {
      logger.warn("Session lost, logging out...");
      logout();
    });

    // 5. Auth Check
    setIsVerifyingAuth(true);
    try {
      const tokens = await TokenService.getTokens();
      if (tokens) {
        logger.debug("Stored tokens found, fetching user profile...");
        const user = await me();
        setUser(user);
        logger.debug(`User profile loaded: ${user.username}`);
      } else {
        logger.debug("No stored tokens found.");
      }
    } catch (error) {
      logger.debug(
        `Initial authentication check failed (likely session expired): ${error}`,
      );
      // No need to throw, user stays unauthenticated
    } finally {
      setIsVerifyingAuth(false);
      setIsInitializing(false);
    }
  }, [logout, setIsVerifyingAuth, setUser]);

  useEffect(() => {
    initApplication();
  }, [initApplication]);

  const isLoading = isInitializing || isVerifyingAuth;

  return {
    isLoading,
    isAuthenticated,
  };
}
