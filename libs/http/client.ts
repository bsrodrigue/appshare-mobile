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
import { ApiResponse, ErrorModel } from "@/modules/shared";

export class HTTPClient {
  private instance: AxiosInstance;
  private logger: Logger;
  private tokenRefreshHandler:
    | ((refreshToken: string) => Promise<TokenPair | null>)
    | null = null;
  private refreshFailureHandler: (() => void) | null = null;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.logger = new Logger("HTTPClient");
    this.logger.debug(`Initializing HTTPClient with baseURL: ${baseURL}`);

    this.instance = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...config,
    });

    this.setupInterceptors();
  }

  /**
   * Inject the token refresh logic.
   * This is done via dependency injection to avoid circular dependencies
   * between HTTPClient and the Auth API.
   */
  public setTokenRefreshHandler(
    handler: (refreshToken: string) => Promise<TokenPair | null>,
  ): void {
    this.tokenRefreshHandler = handler;
  }

  /**
   * Inject the handler for when token refresh fails (e.g., redirect to login).
   */
  public setRefreshFailureHandler(handler: () => void): void {
    this.refreshFailureHandler = handler;
  }

  private setupInterceptors(): void {
    // ========================================
    // Request Interceptor
    // ========================================
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const tokens = await TokenService.getTokens();

        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        const reqString = `${config.method?.toUpperCase()} ${config.url}`;
        this.logger.debug(`Request: ${reqString}`);

        if (config.data) {
          this.logger.debug(
            `Request\nBody: ${JSONService.stringify(config.data)}`,
          );
        }

        return config;
      },
      (error: AxiosError) => {
        this.logger.error(`Request Error: ${error.message}`);
        return Promise.reject(error);
      },
    );

    // ========================================
    // Response Interceptor
    // ========================================
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data) {
          this.logger.debug(
            `Response\nStatus: ${response.status}\nURL: ${response.config.url}\nBody: ${JSONService.stringify(response.data)}`,
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized - Attempt Token Refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.tokenRefreshHandler
        ) {
          if (this.isRefreshing) {
            // Already refreshing, queue this request
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const tokens = await TokenService.getTokens();
            if (!tokens?.refreshToken) {
              throw new Error("No refresh token available");
            }

            this.logger.debug("Attempting token refresh...");
            const newTokens = await this.tokenRefreshHandler(
              tokens.refreshToken,
            );

            if (!newTokens) {
              throw new Error("Token refresh handler returned null");
            }

            this.onRefreshed(newTokens.accessToken);
            this.isRefreshing = false;

            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            this.logger.error(`Token refresh failed: ${refreshError}`);

            if (this.refreshFailureHandler) {
              this.refreshFailureHandler();
            }

            return Promise.reject(error);
          }
        }

        // Log formatted error details
        if (error.response) {
          const errorData = error.response.data as ErrorModel;
          this.logger.error(
            `HTTP Error ${error.response.status}: ${errorData.detail ?? error.message}`,
          );
        } else {
          this.logger.error(`Network/Unknown Error: ${error.message}`);
        }

        return Promise.reject(error);
      },
    );
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.map((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  // ========================================
  // HTTP Methods
  // ========================================

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}
