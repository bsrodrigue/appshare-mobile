import { HTTPClient } from "@/libs/http/client";
import { Logger } from "../log";
import { TokenPair } from "../token";

/**
 * APIService acts as a singleton manager for the application's HTTP client.
 * It ensures a single instance of HTTPClient is used throughout the app.
 */
export class APIService {
  private static readonly logger = new Logger("APIService");
  private static defaultClient: HTTPClient | null = null;
  private static isInitialized: boolean = false;
  private static logoutHandler: (() => void) | null = null;

  /**
   * Initialize the default HTTP client with a base URL.
   */
  public static initializeDefaultClient(baseURL: string): void {
    if (APIService.isInitialized && APIService.defaultClient) {
      this.logger.debug("APIService already initialized. Skipping.");
      return;
    }

    APIService.defaultClient = new HTTPClient(baseURL);

    // Set up refresh failure handler (usually triggers logout)
    APIService.defaultClient.setRefreshFailureHandler(() => {
      this.logger.warn("Token refresh failed. Executing logout handler.");
      if (APIService.logoutHandler) {
        APIService.logoutHandler();
      }
    });

    APIService.isInitialized = true;
    this.logger.debug(`APIService initialized with baseURL: ${baseURL}`);
  }

  /**
   * Returns the singleton HTTPClient instance.
   * @throws Error if the client has not been initialized.
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
   * Sets the logic for token refresh.
   * Injected at runtime to avoid circular dependencies with Auth API.
   */
  public static setTokenRefreshHandler(
    handler: (refreshToken: string) => Promise<TokenPair | null>,
  ): void {
    if (!APIService.defaultClient) {
      this.logger.error("Cannot set refresh handler before initialization.");
      return;
    }
    APIService.defaultClient.setTokenRefreshHandler(handler);
  }

  /**
   * Sets the logic for what happens when the session is lost (e.g., clear store and redirect).
   */
  public static setLogoutHandler(handler: () => void): void {
    APIService.logoutHandler = handler;
  }
}
