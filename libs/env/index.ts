import Constants from "expo-constants";
import * as z from "zod";
import { Logger } from "../log";

const logger = new Logger("EnvService");

/**
 * Environment variable schema definition
 * Add all required environment variables here
 */
const envSchema = z.object({
  // API Configuration
  API_URL: z.url("API URL must be a valid URL"),
});

type Env = z.infer<typeof envSchema>;

/**
 * EnvService - Fully static environment variable manager
 *
 * Features:
 * - Validates all required environment variables at application start
 * - Exposes env vars through predictable static getters
 * - Throws clear errors for missing variables
 * - No instance needed (fully static)
 *
 * Usage:
 * 1. Call EnvService.init() at application start (e.g., in App.tsx or _layout.tsx)
 * 2. Access variables via EnvService.GOOGLE_MAPS_API_KEY, EnvService.ONESIGNAL_APP_ID, etc.
 */
export default class EnvService {
  private static env: Env | null = null;
  private static initialized = false;

  /**
   * Private constructor to prevent instantiation
   */
  private constructor() {
    throw new Error("EnvService is a static class and cannot be instantiated");
  }

  /**
   * Initialize and validate environment variables
   * Must be called at application start before accessing any env vars
   *
   * @throws {z.ZodError} If required environment variables are missing or invalid
   */
  public static init(): void {
    if (this.initialized) {
      return;
    }

    try {
      // Read from Constants.expoConfig.extra (baked in at build time from app.config.ts)
      const extra = Constants.expoConfig?.extra ?? {};

      for (const [key, value] of Object.entries(extra)) {
        logger.debug(`${key}: ${value}`);
      }

      this.env = envSchema.parse(extra);
      this.initialized = true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingVars = error.issues
          .map((issue: z.ZodIssue) => {
            const path = issue.path.join(".");
            return `  - ${path}: ${issue.message}`;
          })
          .join("\n");

        throw new Error(
          `❌ Environment variable validation failed:\n${missingVars}\n\n` +
            `Please check your .env file and ensure all required variables are set.`,
        );
      }
      throw error;
    }
  }

  /**
   * Ensure the service has been initialized
   * @throws {Error} If init() has not been called
   */
  private static ensureInitialized(): void {
    if (!this.initialized || !this.env) {
      throw new Error(
        "EnvService has not been initialized. Call EnvService.init() at application start.",
      );
    }
  }

  /**
   * Get all environment variables (use sparingly, prefer specific getters)
   */
  public static getAll(): Readonly<Env> {
    this.ensureInitialized();
    return this.env!;
  }

  // ============================================================================
  // Static Getters - Predictable access to environment variables
  // ============================================================================

  /**
   * API Base URL
   */
  public static get API_URL(): string {
    this.ensureInitialized();
    return this.env!.API_URL;
  }

  /**
   * Check if running in development mode
   */
  public static get isDevelopment(): boolean {
    return __DEV__;
  }

  /**
   * Check if running in production mode
   */
  public static get isProduction(): boolean {
    return !__DEV__;
  }
}
