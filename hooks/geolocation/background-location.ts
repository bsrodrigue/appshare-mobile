import { BackgroundLocationService } from "@/libs/geolocation/background-location";
import { Logger } from "@/libs/log";
import { useFocusEffect } from "expo-router";
import React from "react";

const logger = new Logger("useBackgroundLocation");

export default function useBackgroundLocation() {
  const startBackgroundTracking = async () => {
    try {
      const success = await BackgroundLocationService.startTracking();

      if (success) {
        logger.debug("Background tracking started successfully");
      } else {
        logger.error("Failed to start background tracking");
      }
    } catch (error) {
      logger.exception(error as Error, "Error starting background tracking");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      startBackgroundTracking();

      return () => {
        logger.debug("Stopping background location tracking");
        BackgroundLocationService.stopTracking();
      };
    }, []),
  );
}
