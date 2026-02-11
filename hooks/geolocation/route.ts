import { Logger } from "@/libs/log";
import { MapService, Route } from "@/libs/maps";
import { Coords } from "@/modules/shared";
import { useCallback, useEffect, useRef, useState } from "react";

interface RouteProps {
  start: Coords;
  destination: Coords;
  mode?: "driving" | "walking";
}

export default function useRoute({
  start,
  destination,
  mode = "driving",
}: RouteProps) {
  const logger = useRef(new Logger("useRoute")).current;
  const [route, setRoute] = useState<Route | null>(null);
  const mapService = useRef(new MapService()).current;

  const clear = useCallback(() => {
    setRoute(null);
  }, []);

  // Extract primitive values to avoid object reference issues in dependency array
  const startLat = start?.latitude ?? 0;
  const startLng = start?.longitude ?? 0;
  const destLat = destination?.latitude ?? 0;
  const destLng = destination?.longitude ?? 0;

  useEffect(() => {
    let cancelled = false;

    const fetchRoute = async () => {
      // Skip if coordinates are invalid (0,0)
      if (startLat === 0 || startLng === 0 || destLat === 0 || destLng === 0) {
        logger.debug("Skipping fetch - invalid coordinates");
        return;
      }

      try {
        logger.debug(
          `Fetching route: (${startLat}, ${startLng}) -> (${destLat}, ${destLng})`,
        );

        const fetchedRoute = await mapService.getDirections({
          origin: { latitude: startLat, longitude: startLng },
          destination: { latitude: destLat, longitude: destLng },
          mode,
        });

        if (!cancelled) {
          setRoute(fetchedRoute);
          logger.debug(
            `Route updated: ${fetchedRoute.distance.text}, ${fetchedRoute.duration.text}`,
          );
        }
      } catch (error) {
        logger.error(
          `Failed to fetch route between (${startLat}, ${startLng}) and (${destLat}, ${destLng})`,
          error,
        );
        if (!cancelled) {
          setRoute(null);
        }
      }
    };

    fetchRoute();

    return () => {
      cancelled = true;
    };
  }, [startLat, startLng, destLat, destLng, mode, mapService, logger]);

  return {
    route,
    clear,
  };
}
