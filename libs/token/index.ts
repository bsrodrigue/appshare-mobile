import * as SecureStore from "expo-secure-store";
import { Logger } from "../log";

const logger = new Logger("TokenService");

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const ACCESS_EXPIRES_KEY = "auth_access_expires_at";
const REFRESH_EXPIRES_KEY = "auth_refresh_expires_at";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

/**
 * TokenService manages the storage and retrieval of authentication tokens.
 * It uses Expo SecureStore for encrypted storage on device.
 */
export class TokenService {
  /**
   * Store a pair of tokens and their expiration dates
   */
  public static async storeTokens(tokens: TokenPair): Promise<void> {
    try {
      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
        SecureStore.setItemAsync(
          ACCESS_EXPIRES_KEY,
          tokens.accessTokenExpiresAt,
        ),
        SecureStore.setItemAsync(
          REFRESH_EXPIRES_KEY,
          tokens.refreshTokenExpiresAt,
        ),
      ]);
      logger.debug("Tokens stored successfully");
    } catch (error) {
      logger.error("Failed to store tokens", error);
      throw error;
    }
  }

  /**
   * Retrieve the current token pair
   */
  public static async getTokens(): Promise<TokenPair | null> {
    try {
      const [accessToken, refreshToken, accessExpires, refreshExpires] =
        await Promise.all([
          SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
          SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
          SecureStore.getItemAsync(ACCESS_EXPIRES_KEY),
          SecureStore.getItemAsync(REFRESH_EXPIRES_KEY),
        ]);

      if (!accessToken || !refreshToken || !accessExpires || !refreshExpires) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessExpires,
        refreshTokenExpiresAt: refreshExpires,
      };
    } catch (error) {
      logger.error("Failed to retrieve tokens", error);
      return null;
    }
  }

  /**
   * Clear all stored tokens (use for logout)
   */
  public static async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(ACCESS_EXPIRES_KEY),
        SecureStore.deleteItemAsync(REFRESH_EXPIRES_KEY),
      ]);
      logger.debug("Tokens cleared");
    } catch (error) {
      logger.error("Failed to clear tokens", error);
    }
  }

  /**
   * Check if the access token is missing or expired
   */
  public static async isAccessTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return true;

    const expiresAt = new Date(tokens.accessTokenExpiresAt).getTime();
    const now = new Date().getTime();

    // Buffer of 30 seconds to prevent edge cases
    return expiresAt - now < 30000;
  }

  /**
   * Check if the refresh token is missing or expired
   */
  public static async isRefreshTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return true;

    const expiresAt = new Date(tokens.refreshTokenExpiresAt).getTime();
    const now = new Date().getTime();

    return expiresAt < now;
  }
}
