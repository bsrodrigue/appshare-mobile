import { HTTPClient } from "@/libs/http/client";
import { TokenPair, TokenService } from "@/libs/token";
import { Logger } from "../log";

/**
 * Singleton API Service that manages the HTTP client.
 * Handles initialization and provides access to the configured client.
 */
export class APIService {
  private static defaultClient: HTTPClient;
  private static isInitialized: boolean = false;
  private static logoutHandler: (() => void) | null = null;

  /**
   * Initializes the API client with the base URL.
   * Should be called once at app startup.
   */
  public static initializeDefaultClient(baseURL: string): void {
    if (APIService.isInitialized) {
      Logger.debug(
        "APIService has already been initialized. Skipping re-initialization.",
      );
      return;
    }

    APIService.defaultClient = new HTTPClient(baseURL, {});

    // Set up token refresh handler
    APIService.defaultClient.setTokenRefreshHandler(
      APIService.handleTokenRefresh,
    );

    // Set up refresh failure handler (triggers logout)
    APIService.defaultClient.setRefreshFailureHandler(() => {
      Logger.debug("APIService: Token refresh failed, triggering logout");
      if (APIService.logoutHandler) {
        APIService.logoutHandler();
      }
    });

    APIService.isInitialized = true;
    Logger.debug(`APIService initialized with baseURL: ${baseURL}`);
  }

  /**
   * Gets the configured HTTP client.
   * Throws if not initialized.
   */
  public static getClient(): HTTPClient {
    if (!APIService.isInitialized || !APIService.defaultClient) {
      throw new Error(
        "APIService not initialized. Call APIService.initializeDefaultClient() first.",
      );
    }
    return APIService.defaultClient;
  }

  /**
   * Sets the logout handler to be called when token refresh fails.
   * This should be connected to your auth store's logout action.
   */
  public static setLogoutHandler(handler: () => void): void {
    APIService.logoutHandler = handler;
  }

  /**
   * Handles token refresh by calling the refresh endpoint.
   * This is called by the HTTP client when a token needs to be refreshed.
   */
  private static async handleTokenRefresh(
    refreshToken: string,
  ): Promise<TokenPair | null> {
    try {
      Logger.debug("APIService: Refreshing token...");

      // Import dynamically to avoid circular dependency
      const { refreshToken: refreshTokenFn } =
        await import("@/modules/auth/api");

      const response = await refreshTokenFn({ refresh_token: refreshToken });

      const newTokens: TokenPair = {
        accessToken: response.data.tokens.access_token,
        refreshToken: response.data.tokens.refresh_token,
        accessTokenExpiresAt: response.data.tokens.access_token_expires_at,
        refreshTokenExpiresAt: response.data.tokens.refresh_token_expires_at,
      };

      // Store the new tokens
      await TokenService.storeTokens(newTokens);

      Logger.debug("APIService: Token refresh successful");
      return newTokens;
    } catch (error) {
      Logger.error(`APIService: Token refresh failed - ${error}`);
      return null;
    }
  }
}
