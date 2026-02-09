import { Logger } from "@/libs/log";
import { MapService, Route } from "@/libs/maps";
import { Coords } from "@/types/geolocation";
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
        Logger.debug("useRoute: Skipping fetch - invalid coordinates");
        return;
      }

      try {
        Logger.setModuleName("useRoute");
        Logger.debug(
          `Fetching route: (${startLat}, ${startLng}) -> (${destLat}, ${destLng})`
        );

        const fetchedRoute = await mapService.getDirections({
          origin: { latitude: startLat, longitude: startLng },
          destination: { latitude: destLat, longitude: destLng },
          mode,
        });

        if (!cancelled) {
          setRoute(fetchedRoute);
          Logger.debug(
            `Route updated: ${fetchedRoute.distance.text}, ${fetchedRoute.duration.text}`
          );
        }
      } catch (error) {
        Logger.error("Failed to fetch route", error);
        if (!cancelled) {
          setRoute(null);
        }
      }
    };

    fetchRoute();

    return () => {
      cancelled = true;
    };
  }, [startLat, startLng, destLat, destLng, mode, mapService]);

  return {
    route,
    clear,
  };
}
