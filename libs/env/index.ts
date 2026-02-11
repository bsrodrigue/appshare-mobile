import Constants from "expo-constants";
import * as z from "zod";
import { Logger } from "../log";

/**
 * Environment variable schema definition
 */
const envSchema = z.object({
  API_URL: z.string().url("API URL must be a valid URL"),
  GOOGLE_MAPS_API_KEY: z.string().min(1, "Google Maps API Key is required"),
  GOOGLE_MAPS_DIRECTIONS_BASE_URL: z.string().optional(),
  ONESIGNAL_APP_ID: z.string().min(1, "OneSignal App ID is required"),
  PUSHER_KEY: z.string().min(1, "Pusher Key is required"),
  PUSHER_CLUSTER: z.string().min(1, "Pusher Cluster is required"),
});

type Env = z.infer<typeof envSchema>;

export default class EnvService {
  private static readonly logger = new Logger("EnvService");
  private static env: Env | null = null;
  private static initialized = false;

  private constructor() {
    throw new Error("EnvService is a static class and cannot be instantiated");
  }

  public static init(): void {
    if (this.initialized) return;

    try {
      const extra = Constants.expoConfig?.extra ?? {};
      this.env = envSchema.parse(extra);
      this.initialized = true;
      this.logger.debug("EnvService initialized successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missing = error.issues.map((i) => i.path.join(".")).join(", ");
        throw new Error(`Environment validation failed for: ${missing}`);
      }
      throw error;
    }
  }

  private static getVar<K extends keyof Env>(key: K): Env[K] {
    if (!this.initialized || !this.env) {
      this.init();
    }
    return this.env![key];
  }

  public static get API_URL(): string {
    return this.getVar("API_URL");
  }
  public static get GOOGLE_MAPS_API_KEY(): string {
    return this.getVar("GOOGLE_MAPS_API_KEY");
  }
  public static get GOOGLE_MAPS_DIRECTIONS_BASE_URL(): string | undefined {
    return this.getVar("GOOGLE_MAPS_DIRECTIONS_BASE_URL");
  }
  public static get ONESIGNAL_APP_ID(): string {
    return this.getVar("ONESIGNAL_APP_ID");
  }
  public static get PUSHER_KEY(): string {
    return this.getVar("PUSHER_KEY");
  }
  public static get PUSHER_CLUSTER(): string {
    return this.getVar("PUSHER_CLUSTER");
  }

  public static get isDevelopment(): boolean {
    return __DEV__;
  }
}
