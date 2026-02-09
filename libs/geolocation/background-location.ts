import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as IntentLauncher from "expo-intent-launcher";
import { Alert, Linking, Platform } from "react-native";
import { Logger } from "../log";
import { updateLocation } from "@/features/delivery-man/api";
import { theme } from "@/ui/theme";

/**
 * Background Location Tracking Service
 * Uses Expo Task Manager to periodically update delivery person's location
 */

const BACKGROUND_LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

// Configuration
const LOCATION_UPDATE_INTERVAL = 30000; // 30 seconds
const DISTANCE_INTERVAL = 5; // 5 meters

/**
 * Define the background task that will be executed when location updates
 */
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    Logger.error(
      `BackgroundLocation: Task error - ${error.message || String(error)}`
    );
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };

    if (locations && locations.length > 0) {
      const location = locations[0];

      Logger.debug(
        `BackgroundLocation: Got location update: ${location.coords.latitude}, ${location.coords.longitude}`
      );

      try {
        // Send location to backend
        await updateLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        Logger.debug(
          "BackgroundLocation: Location sent to backend successfully"
        );
      } catch (error) {
        Logger.exception(
          error as Error,
          "BackgroundLocation: Failed to send location to backend"
        );
      }
    }
  }
});

export class BackgroundLocationService {
  /**
   * Requests background location permissions with user-friendly prompts
   */
  static async requestBackgroundPermissions(): Promise<boolean> {
    try {
      Logger.debug("BackgroundLocation: Requesting background permissions");

      // First check foreground permissions
      const foreground = await Location.getForegroundPermissionsAsync();

      if (foreground.status !== "granted") {
        Logger.debug(
          "BackgroundLocation: Foreground permission not granted, requesting..."
        );

        // Show explanation before requesting
        const shouldRequest = await this.showPermissionExplanation(
          "Autoriser la localisation",
          "Pour vous permettre de réaliser des livraisons, l'application a besoin d'accéder à votre position."
        );

        if (!shouldRequest) {
          return false;
        }

        const foregroundRequest =
          await Location.requestForegroundPermissionsAsync();

        if (foregroundRequest.status !== "granted") {
          Logger.error("BackgroundLocation: Foreground permission denied");
          await this.showGoToSettingsAlert();
          return false;
        }
      }

      // Now request background permissions
      const background = await Location.getBackgroundPermissionsAsync();

      if (background.status !== "granted") {
        // Show explanation before requesting background
        const shouldRequestBackground = await this.showPermissionExplanation(
          "Autoriser la localisation en arrière-plan",
          "Pour suivre vos livraisons même lorsque l'application est fermée, veuillez autoriser l'accès à la localisation 'Toujours'."
        );

        if (!shouldRequestBackground) {
          return false;
        }

        const backgroundRequest =
          await Location.requestBackgroundPermissionsAsync();

        if (backgroundRequest.status !== "granted") {
          Logger.error("BackgroundLocation: Background permission denied");
          await this.showGoToSettingsAlert();
          return false;
        }
      }

      Logger.debug("BackgroundLocation: All permissions granted");
      return true;
    } catch (error) {
      Logger.exception(
        error as Error,
        "BackgroundLocation: Failed to request permissions"
      );
      return false;
    }
  }

  /**
   * Shows a permission explanation alert
   */
  private static showPermissionExplanation(
    title: string,
    message: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        title,
        message,
        [
          {
            text: "Non merci",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Autoriser",
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false }
      );
    });
  }

  /**
   * Shows an alert to guide user to settings when permission is denied
   */
  private static showGoToSettingsAlert(): Promise<void> {
    return new Promise((resolve) => {
      Alert.alert(
        "Autorisation requise",
        "La localisation est nécessaire pour les livraisons. Veuillez activer l'accès à la localisation dans les paramètres de l'application.",
        [
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => resolve(),
          },
          {
            text: "Ouvrir les paramètres",
            onPress: async () => {
              try {
                if (Platform.OS === "ios") {
                  await Linking.openURL("app-settings:");
                } else {
                  await IntentLauncher.startActivityAsync(
                    IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                    {
                      data: "package:com.eliteapp",
                    }
                  );
                }
              } catch (error) {
                Logger.exception(
                  error as Error,
                  "BackgroundLocation: Failed to open settings"
                );
              }
              resolve();
            },
          },
        ],
        { cancelable: false }
      );
    });
  }

  /**
   * Checks if background location tracking is currently running
   */
  static async isTracking(): Promise<boolean> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_LOCATION_TASK
      );
      return isRegistered;
    } catch (error) {
      Logger.exception(
        error as Error,
        "BackgroundLocation: Failed to check tracking status"
      );
      return false;
    }
  }

  /**
   * Checks if GPS is enabled and prompts user to enable it
   * Returns true if GPS is enabled or user chooses to continue without GPS
   */
  static async checkGPSEnabled(): Promise<boolean> {
    try {
      const isEnabled = await Location.hasServicesEnabledAsync();

      if (!isEnabled) {
        Logger.debug("BackgroundLocation: GPS is disabled");

        return new Promise((resolve) => {
          Alert.alert(
            "GPS désactivé",
            "Pour une meilleure précision de localisation, veuillez activer le GPS. Voulez-vous activer le GPS maintenant ?",
            [
              {
                text: "Continuer sans GPS",
                style: "cancel",
                onPress: () => {
                  Logger.debug(
                    "BackgroundLocation: User chose to continue without GPS"
                  );
                  resolve(true); // Continue with Wi-Fi/cellular fallback
                },
              },
              {
                text: "Activer le GPS",
                onPress: async () => {
                  Logger.debug("BackgroundLocation: User chose to enable GPS");
                  try {
                    // Open location settings
                    if (Platform.OS === "ios") {
                      await Linking.openURL("app-settings:");
                    } else {
                      // Android: Open location settings directly
                      await IntentLauncher.startActivityAsync(
                        IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
                      );
                    }
                  } catch (error) {
                    Logger.exception(
                      error as Error,
                      "BackgroundLocation: Failed to open settings"
                    );
                  }
                  resolve(true); // Continue anyway
                },
              },
            ],
            { cancelable: false }
          );
        });
      }

      Logger.debug("BackgroundLocation: GPS is enabled");
      return true;
    } catch (error) {
      Logger.exception(
        error as Error,
        "BackgroundLocation: Failed to check GPS status"
      );
      return true; // Continue anyway on error
    }
  }

  /**
   * Starts background location tracking
   */
  static async startTracking(): Promise<boolean> {
    try {
      Logger.debug("BackgroundLocation: Starting tracking");

      // Check if already tracking
      const isAlreadyTracking = await this.isTracking();
      if (isAlreadyTracking) {
        Logger.debug("BackgroundLocation: Already tracking, skipping start");
        return true;
      }

      // Check GPS and prompt user if needed
      const shouldContinue = await this.checkGPSEnabled();
      if (!shouldContinue) {
        Logger.debug("BackgroundLocation: GPS check cancelled by user");
        return false;
      }

      // Request permissions
      const hasPermissions = await this.requestBackgroundPermissions();
      if (!hasPermissions) {
        Logger.error(
          "BackgroundLocation: Cannot start tracking without permissions"
        );
        return false;
      }

      // Start location updates
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.High,
        timeInterval: LOCATION_UPDATE_INTERVAL,
        distanceInterval: DISTANCE_INTERVAL,
        foregroundService: {
          notificationTitle: "Elite App",
          notificationBody: "Suivi de votre position en cours",
          notificationColor: theme.colors.accent,
        },
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
      });

      Logger.debug("BackgroundLocation: Tracking started successfully");
      return true;
    } catch (error) {
      Logger.exception(
        error as Error,
        "BackgroundLocation: Failed to start tracking"
      );
      return false;
    }
  }

  /**
   * Stops background location tracking
   */
  static async stopTracking(): Promise<void> {
    try {
      Logger.debug("BackgroundLocation: Stopping tracking");

      const isTracking = await this.isTracking();
      if (!isTracking) {
        Logger.debug("BackgroundLocation: Not tracking, skipping stop");
        return;
      }

      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      Logger.debug("BackgroundLocation: Tracking stopped successfully");
    } catch (error) {
      Logger.exception(
        error as Error,
        "BackgroundLocation: Failed to stop tracking"
      );
    }
  }

  /**
   * Gets the task name (useful for debugging)
   */
  static getTaskName(): string {
    return BACKGROUND_LOCATION_TASK;
  }
}
