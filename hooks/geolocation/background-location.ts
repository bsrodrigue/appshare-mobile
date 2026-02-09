import { BackgroundLocationService } from "@/libs/geolocation/background-location";
import { Logger } from "@/libs/log";
import { useFocusEffect } from "expo-router";
import React from "react";

export default function useBackgroundLocation() {
  const startBackgroundTracking = async () => {
    try {
      const success = await BackgroundLocationService.startTracking();

      if (success) {
        Logger.debug(
          "useBackgroundLocation: Background tracking started successfully"
        );
      } else {
        Logger.error(
          "useBackgroundLocation: Failed to start background tracking"
        );
      }
    } catch (error) {
      Logger.exception(
        error as Error,
        "useBackgroundLocation: Error starting background tracking"
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      startBackgroundTracking();

      return () => {
        Logger.debug(
          "useBackgroundLocation: Stopping background location tracking"
        );
        BackgroundLocationService.stopTracking();
      };
    }, [])
  );
}
