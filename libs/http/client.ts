import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { Logger } from "../log";
import { JSONService } from "../json";
import { TokenService, TokenPair } from "../token";

// ============================================================================
// Types
// ============================================================================

export interface APIResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * Standard API error response from the server.
 */
export type APIError = {
  status?: number;
  message: string;
  code?: string;
  detail?: string;
  errors?: Array<{
    location?: string;
    message?: string;
    value?: unknown;
  }>;
};

/**
 * Configuration for the HTTP client.
 */
interface HTTPClientConfig extends AxiosRequestConfig {
  /** Function to call when tokens need to be refreshed */
  onTokenRefresh?: (refreshToken: string) => Promise<TokenPair | null>;
  /** Function to call when refresh fails (e.g., logout user) */
  onRefreshFailure?: () => void;
}

// ============================================================================
// HTTP Client
// ============================================================================

export class HTTPClient {
  private instance: AxiosInstance;
  private onTokenRefresh?: (refreshToken: string) => Promise<TokenPair | null>;
  private onRefreshFailure?: () => void;

  constructor(baseURL: string, config?: HTTPClientConfig) {
    const logStr = `HTTPClient Constructor: \n\tBASE_URL: ${baseURL}`;

    Logger.setModuleName("HTTPClient");
    Logger.debug(logStr);

    this.onTokenRefresh = config?.onTokenRefresh;
    this.onRefreshFailure = config?.onRefreshFailure;

    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });

    this.setupInterceptors();
  }

  /**
   * Sets the token refresh handler.
   * This should be called after APIService initialization with the refresh function.
   */
  public setTokenRefreshHandler(
    handler: (refreshToken: string) => Promise<TokenPair | null>,
  ): void {
    this.onTokenRefresh = handler;
  }

  /**
   * Sets the refresh failure handler (e.g., to trigger logout).
   */
  public setRefreshFailureHandler(handler: () => void): void {
    this.onRefreshFailure = handler;
  }

  private setupInterceptors(): void {
    // ========================================
    // Request Interceptor
    // ========================================
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        Logger.setModuleName("HTTPClient");

        const reqString = `${config.method?.toUpperCase()} ${config.url} ${JSONService.stringify(config.data) ?? ""}`;
        Logger.debug(`Request: ${reqString}`);

        try {
          // Check if we need to refresh the token before making the request
          const isExpired = await TokenService.isAccessTokenExpired();
          if (isExpired && this.onTokenRefresh) {
            await this.attemptTokenRefresh();
          }

          // Attach the access token
          const token = await TokenService.getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          Logger.error(`Failed to load/refresh token: ${error}`);
        }

        return config;
      },

      (error: AxiosError) => {
        Logger.error(`Request Error: ${JSON.stringify(error)}`);
        return Promise.reject(error);
      },
    );

    // ========================================
    // Response Interceptor
    // ========================================
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        Logger.setModuleName("HTTPClient");
        Logger.debug(`Response: ${JSONService.stringify(response.data)}`);
        return response;
      },

      async (error: AxiosError<APIError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await this.attemptTokenRefresh();
            if (refreshed) {
              // Retry the original request with new token
              const token = await TokenService.getAccessToken();
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            Logger.error(`Token refresh failed: ${refreshError}`);
            // Refresh failed, trigger logout
            if (this.onRefreshFailure) {
              this.onRefreshFailure();
            }
            return Promise.reject(error);
          }
        }

        // Log error details
        if (error.response) {
          const apiError = error.response.data as APIError;
          const errorString = `
                        Status: ${error.response.status}
                        Code: ${apiError.code ?? error.code}
                        Message: ${apiError.message ?? apiError.detail}
                        Errors: ${JSON.stringify(apiError.errors ?? [])}
                    `;
          Logger.error(errorString);
        } else if (error.request) {
          Logger.error(`Request Error (No Response): ${JSON.stringify(error)}`);
        } else {
          Logger.error(`Request Error: ${JSON.stringify(error)}`);
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * Attempts to refresh the access token using the refresh token.
   * Coordinates multiple simultaneous refresh requests to prevent race conditions.
   */
  private async attemptTokenRefresh(): Promise<boolean> {
    // If already refreshing, wait for the existing refresh to complete
    if (TokenService.getIsRefreshing()) {
      const existingPromise = TokenService.getRefreshPromise();
      if (existingPromise) {
        const result = await existingPromise;
        return result !== null;
      }
      return false;
    }

    // Check if refresh token is available and not expired
    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) {
      Logger.debug("No refresh token available");
      return false;
    }

    const isRefreshExpired = await TokenService.isRefreshTokenExpired();
    if (isRefreshExpired) {
      Logger.debug("Refresh token is expired");
      if (this.onRefreshFailure) {
        this.onRefreshFailure();
      }
      return false;
    }

    if (!this.onTokenRefresh) {
      Logger.debug("No token refresh handler configured");
      return false;
    }

    // Start the refresh process
    TokenService.setIsRefreshing(true);

    const refreshPromise = (async (): Promise<TokenPair | null> => {
      try {
        Logger.debug("Attempting token refresh...");
        const newTokens = await this.onTokenRefresh!(refreshToken);

        if (newTokens) {
          await TokenService.storeTokens(newTokens);
          Logger.debug("Token refresh successful");
          return newTokens;
        }

        Logger.debug("Token refresh returned null");
        return null;
      } catch (error) {
        Logger.error(`Token refresh error: ${error}`);
        return null;
      } finally {
        TokenService.setIsRefreshing(false);
        TokenService.setRefreshPromise(null);
      }
    })();

    TokenService.setRefreshPromise(refreshPromise);

    const result = await refreshPromise;
    return result !== null;
  }

  // ========================================
  // HTTP Methods
  // ========================================

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    const response = await this.instance.get<T>(url, config);
    return this.handleResponse(response);
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    const response = await this.instance.post<T>(url, data, config);
    return this.handleResponse(response);
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    const response = await this.instance.put<T>(url, data, config);
    return this.handleResponse(response);
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    const response = await this.instance.patch<T>(url, data, config);
    return this.handleResponse(response);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    const response = await this.instance.delete<T>(url, config);
    return this.handleResponse(response);
  }

  // ========================================
  // Response Handling
  // ========================================

  private handleResponse<T>(response: AxiosResponse<T>): APIResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }
}
