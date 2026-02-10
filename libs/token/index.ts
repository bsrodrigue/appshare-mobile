import { SecureStorage } from "../secure-storage";
import { SecureStorageKey } from "../secure-storage/keys";
import { Logger } from "../log";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

/**
 * Service for managing authentication tokens.
 * Handles storage, retrieval, and expiration checking.
 */
export class TokenService {
  private static isRefreshing = false;
  private static refreshPromise: Promise<TokenPair | null> | null = null;

  /**
   * Stores the complete token pair in secure storage.
   */
  static async storeTokens(tokens: TokenPair): Promise<void> {
    try {
      await Promise.all([
        SecureStorage.setItem(
          SecureStorageKey.ACCESS_TOKEN,
          tokens.accessToken,
        ),
        SecureStorage.setItem(
          SecureStorageKey.REFRESH_TOKEN,
          tokens.refreshToken,
        ),
        SecureStorage.setItem(
          SecureStorageKey.ACCESS_TOKEN_EXPIRES_AT,
          tokens.accessTokenExpiresAt,
        ),
        SecureStorage.setItem(
          SecureStorageKey.REFRESH_TOKEN_EXPIRES_AT,
          tokens.refreshTokenExpiresAt,
        ),
      ]);
      Logger.debug("TokenService: Tokens stored successfully");
    } catch (error) {
      Logger.error(`TokenService: Failed to store tokens - ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves the current access token.
   */
  static async getAccessToken(): Promise<string | null> {
    return SecureStorage.getItem(SecureStorageKey.ACCESS_TOKEN);
  }

  /**
   * Retrieves the current refresh token.
   */
  static async getRefreshToken(): Promise<string | null> {
    return SecureStorage.getItem(SecureStorageKey.REFRESH_TOKEN);
  }

  /**
   * Retrieves the complete token pair.
   */
  static async getTokens(): Promise<TokenPair | null> {
    try {
      const [
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      ] = await Promise.all([
        SecureStorage.getItem(SecureStorageKey.ACCESS_TOKEN),
        SecureStorage.getItem(SecureStorageKey.REFRESH_TOKEN),
        SecureStorage.getItem(SecureStorageKey.ACCESS_TOKEN_EXPIRES_AT),
        SecureStorage.getItem(SecureStorageKey.REFRESH_TOKEN_EXPIRES_AT),
      ]);

      if (!accessToken || !refreshToken) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt || "",
        refreshTokenExpiresAt: refreshTokenExpiresAt || "",
      };
    } catch (error) {
      Logger.error(`TokenService: Failed to retrieve tokens - ${error}`);
      return null;
    }
  }

  /**
   * Clears all stored tokens (used during logout).
   */
  static async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStorage.removeItem(SecureStorageKey.ACCESS_TOKEN),
        SecureStorage.removeItem(SecureStorageKey.REFRESH_TOKEN),
        SecureStorage.removeItem(SecureStorageKey.ACCESS_TOKEN_EXPIRES_AT),
        SecureStorage.removeItem(SecureStorageKey.REFRESH_TOKEN_EXPIRES_AT),
        // Also clear legacy token
        SecureStorage.removeItem(SecureStorageKey.BEARER_TOKEN),
      ]);
      Logger.debug("TokenService: Tokens cleared successfully");
    } catch (error) {
      Logger.error(`TokenService: Failed to clear tokens - ${error}`);
      throw error;
    }
  }

  /**
   * Checks if the access token is expired or about to expire (within 30 seconds buffer).
   */
  static async isAccessTokenExpired(): Promise<boolean> {
    try {
      const expiresAt = await SecureStorage.getItem(
        SecureStorageKey.ACCESS_TOKEN_EXPIRES_AT,
      );
      if (!expiresAt) return true;

      const expirationDate = new Date(expiresAt);
      const now = new Date();
      // Add 30 second buffer to account for network latency
      const bufferMs = 30 * 1000;

      return now.getTime() >= expirationDate.getTime() - bufferMs;
    } catch (error) {
      Logger.error(`TokenService: Failed to check token expiration - ${error}`);
      return true; // Assume expired on error
    }
  }

  /**
   * Checks if the refresh token is expired.
   */
  static async isRefreshTokenExpired(): Promise<boolean> {
    try {
      const expiresAt = await SecureStorage.getItem(
        SecureStorageKey.REFRESH_TOKEN_EXPIRES_AT,
      );
      if (!expiresAt) return true;

      const expirationDate = new Date(expiresAt);
      const now = new Date();

      return now.getTime() >= expirationDate.getTime();
    } catch (error) {
      Logger.error(
        `TokenService: Failed to check refresh token expiration - ${error}`,
      );
      return true;
    }
  }

  /**
   * Gets the refreshing state for coordinating refresh requests.
   */
  static getIsRefreshing(): boolean {
    return this.isRefreshing;
  }

  static setIsRefreshing(value: boolean): void {
    this.isRefreshing = value;
  }

  static getRefreshPromise(): Promise<TokenPair | null> | null {
    return this.refreshPromise;
  }

  static setRefreshPromise(promise: Promise<TokenPair | null> | null): void {
    this.refreshPromise = promise;
  }
}
