import { HTTPClient } from "@/libs/http/client";
import { Logger } from "@/libs/log";
import polyline from "@mapbox/polyline";
import EnvService from "@/libs/env";

// --- Types & Interfaces ---

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface DirectionsRequest {
  origin: Coordinate;
  destination: Coordinate;
  mode?: "driving" | "walking" | "bicycling" | "transit";
  alternatives?: boolean;
}

export interface GoogleDirectionsResponse {
  routes: Array<{
    overview_polyline: {
      points: string;
    };
    legs: Array<{
      distance: {
        text: string;
        value: number; // in meters
      };
      duration: {
        text: string;
        value: number; // in seconds
      };
      start_address: string;
      end_address: string;
    }>;
    summary: string;
  }>;
  status: string;
  error_message?: string;
}

export interface Route {
  coordinates: Coordinate[];
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  summary: string;
}

// --- MapService Class ---

export class MapService {
  private httpClient: HTTPClient;
  private apiKey: string;

  constructor(apiKey?: string) {
    Logger.setModuleName("MapService");

    // Use provided API key or fall back to EnvService
    this.apiKey = apiKey || EnvService.GOOGLE_MAPS_API_KEY;

    if (!this.apiKey) {
      Logger.error("Google Maps API key not provided");
      throw new Error("Google Maps API key is required for MapService");
    }

    // Create a separate HTTP client for Google Maps API
    this.httpClient = new HTTPClient("https://maps.googleapis.com/maps/api", {
      timeout: 15000, // Longer timeout for external API
    });

    Logger.debug("MapService initialized");
  }

  /**
   * Fetch directions between origin and destination
   */
  async getDirections(request: DirectionsRequest): Promise<Route> {
    Logger.setModuleName("MapService");

    const {
      origin,
      destination,
      mode = "driving",
      alternatives = false,
    } = request;

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    const url = `/directions/json?origin=${originStr}&destination=${destinationStr}&mode=${mode}&alternatives=${alternatives}&key=${this.apiKey}`;

    try {
      Logger.debug(
        `Fetching directions from ${originStr} to ${destinationStr}`
      );

      const response = await this.httpClient.get<GoogleDirectionsResponse>(url);

      if (response.data.status !== "OK") {
        const errorMsg = response.data.error_message || response.data.status;
        Logger.error(`Google Directions API error: ${errorMsg}`);
        throw new Error(`Directions API error: ${errorMsg}`);
      }

      if (!response.data.routes || response.data.routes.length === 0) {
        throw new Error("No routes found");
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      // Decode polyline into coordinates
      const coordinates = this.decodePolyline(route.overview_polyline.points);

      Logger.debug(`Route found: ${leg.distance.text}, ${leg.duration.text}`);

      return {
        coordinates,
        distance: leg.distance,
        duration: leg.duration,
        summary: route.summary,
      };
    } catch (error) {
      Logger.error(`Failed to fetch directions: ${error}`);
      throw error;
    }
  }

  /**
   * Decode Google's encoded polyline into coordinates
   */
  decodePolyline(encodedPolyline: string): Coordinate[] {
    try {
      // @mapbox/polyline returns [lat, lng] tuples
      const decoded = polyline.decode(encodedPolyline);

      // Convert to our Coordinate format
      return decoded.map(([latitude, longitude]: [number, number]) => ({
        latitude,
        longitude,
      }));
    } catch (error) {
      Logger.error(`Failed to decode polyline: ${error}`);
      throw new Error("Failed to decode polyline");
    }
  }

  /**
   * Calculate straight-line distance between two coordinates (Haversine formula)
   * Returns distance in meters
   */
  calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Format distance in meters to human-readable string
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  /**
   * Format duration in seconds to human-readable string
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  }
}

// Export a default instance for convenience
export default MapService;
