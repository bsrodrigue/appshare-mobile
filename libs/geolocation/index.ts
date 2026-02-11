import * as Location from "expo-location";
import { SecureStorage } from "../secure-storage";
import { SecureStorageKey } from "../secure-storage/keys";
import { Logger } from "../log";
import {
  GeolocationPosition,
  CachedGeolocation,
  GeolocationOptions,
  Coordinates,
  SavedLocation,
  CachedGeocodedAddress,
} from "./types";

/**
 * GeolocationService provides a wrapper around Expo Location API
 * with caching capabilities using SecureStorage.
 */
export class GeolocationService {
  private static readonly logger = new Logger("GeolocationService");
  private static readonly CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes default
  private static readonly GEOCODE_CACHE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days for geocoded addresses

  /**
   * Requests location permissions from the user.
   * @returns Permission status
   */
  static async requestPermissions(): Promise<Location.PermissionResponse> {
    try {
      this.logger.debug("Requesting location permissions");
      const permission = await Location.requestForegroundPermissionsAsync();
      this.logger.debug(`Permission status: ${permission.status}`);
      return permission;
    } catch (error) {
      this.logger.exception(error as Error, "Failed to request permissions");
      throw error;
    }
  }

  /**
   * Checks if location permissions are granted.
   * @returns True if permissions are granted
   */
  static async hasPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      this.logger.exception(error as Error, "Failed to check permissions");
      return false;
    }
  }

  /**
   * Gets the current location from the device.
   * @param options Geolocation options
   * @returns Current position
   */
  static async getCurrentPosition(
    options?: GeolocationOptions,
  ): Promise<GeolocationPosition> {
    try {
      this.logger.debug("Getting current position");

      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        throw new Error("Location permissions not granted");
      }

      const accuracy = this.mapAccuracy(options?.accuracy);
      const location = await Location.getCurrentPositionAsync({
        accuracy,
        timeInterval: options?.timeInterval,
        distanceInterval: options?.distanceInterval,
      });

      const position: GeolocationPosition = {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          accuracy: location.coords.accuracy,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          heading: location.coords.heading,
          speed: location.coords.speed,
        },
        timestamp: location.timestamp,
      };

      this.logger.debug(
        `Got position: ${position.coords.latitude}, ${position.coords.longitude}`,
      );

      // Cache the position
      await this.cachePosition(position);

      return position;
    } catch (error) {
      this.logger.exception(error as Error, "Failed to get current position");
      throw error;
    }
  }

  /**
   * Gets the last known location, either from cache or device.
   * @param maxAge Maximum age of cached location in milliseconds (default: 5 minutes)
   * @returns Cached or current position
   */
  static async getLastKnownPosition(
    maxAge: number = this.CACHE_EXPIRY_MS,
  ): Promise<GeolocationPosition | null> {
    try {
      this.logger.debug("Getting last known position");

      // Try to get from cache first
      const cached = await this.getCachedPosition();
      if (cached && this.isCacheValid(cached, maxAge)) {
        this.logger.debug("Returning cached position");
        return cached.position;
      }

      // Try to get last known location from device
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        this.logger.debug("No permissions, returning null");
        return null;
      }

      const location = await Location.getLastKnownPositionAsync();
      if (!location) {
        this.logger.debug("No last known position available");
        return null;
      }

      const position: GeolocationPosition = {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          accuracy: location.coords.accuracy,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          heading: location.coords.heading,
          speed: location.coords.speed,
        },
        timestamp: location.timestamp,
      };

      // Cache the position
      await this.cachePosition(position);

      return position;
    } catch (error) {
      this.logger.exception(
        error as Error,
        "Failed to get last known position",
      );
      return null;
    }
  }

  /**
   * Caches a geolocation position to secure storage.
   * @param position The position to cache
   */
  static async cachePosition(position: GeolocationPosition): Promise<void> {
    try {
      const cached: CachedGeolocation = {
        position,
        cachedAt: Date.now(),
      };

      await SecureStorage.setItem(
        SecureStorageKey.CACHED_GEOLOCATION,
        JSON.stringify(cached),
      );

      this.logger.debug("Position cached successfully");
    } catch (error) {
      this.logger.exception(error as Error, "Failed to cache position");
      // Don't throw - caching failure shouldn't break the app
    }
  }

  /**
   * Retrieves cached geolocation from secure storage.
   * @returns Cached geolocation or null
   */
  static async getCachedPosition(): Promise<CachedGeolocation | null> {
    try {
      const cached = await SecureStorage.getItem(
        SecureStorageKey.CACHED_GEOLOCATION,
      );
      if (!cached) {
        return null;
      }

      const parsed: CachedGeolocation = JSON.parse(cached);
      this.logger.debug("Retrieved cached position");
      return parsed;
    } catch (error) {
      this.logger.exception(error as Error, "Failed to get cached position");
      return null;
    }
  }

  /**
   * Clears the cached geolocation.
   */
  static async clearCache(): Promise<void> {
    try {
      await SecureStorage.removeItem(SecureStorageKey.CACHED_GEOLOCATION);
      this.logger.debug("Cache cleared");
    } catch (error) {
      this.logger.exception(error as Error, "Failed to clear cache");
    }
  }

  /**
   * Checks if cached position is still valid based on age.
   * @param cached The cached geolocation
   * @param maxAge Maximum age in milliseconds
   * @returns True if cache is valid
   */
  private static isCacheValid(
    cached: CachedGeolocation,
    maxAge: number,
  ): boolean {
    const age = Date.now() - cached.cachedAt;
    return age < maxAge;
  }

  /**
   * Maps our accuracy option to Expo's LocationAccuracy enum.
   * @param accuracy Our accuracy string
   * @returns Expo LocationAccuracy value
   */
  private static mapAccuracy(
    accuracy?: "low" | "balanced" | "high" | "highest" | "best_for_navigation",
  ): Location.LocationAccuracy {
    switch (accuracy) {
      case "low":
        return Location.LocationAccuracy.Low;
      case "balanced":
        return Location.LocationAccuracy.Balanced;
      case "high":
        return Location.LocationAccuracy.High;
      case "highest":
        return Location.LocationAccuracy.Highest;
      case "best_for_navigation":
        return Location.LocationAccuracy.BestForNavigation;
      default:
        return Location.LocationAccuracy.Balanced;
    }
  }

  /**
   * Calculates the distance between two coordinates in meters.
   * Uses the Haversine formula.
   * @param coord1 First coordinate
   * @param coord2 Second coordinate
   * @returns Distance in meters
   */
  static calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Generates a cache key from coordinates by rounding to 4 decimal places.
   * This provides ~11 meter precision, which is sufficient for address lookups.
   * @param coords The coordinates to generate a key for
   * @returns A string key for caching
   */
  private static generateCoordinateKey(coords: Coordinates): string {
    const lat = coords.latitude.toFixed(4);
    const lng = coords.longitude.toFixed(4);
    return `${lat},${lng}`;
  }

  /**
   * Caches geocoded addresses for given coordinates.
   * @param coords The coordinates
   * @param addresses The geocoded addresses
   */
  private static async cacheGeocodedAddress(
    coords: Coordinates,
    addresses: Location.LocationGeocodedAddress[],
  ): Promise<void> {
    try {
      const coordinateKey = this.generateCoordinateKey(coords);

      // Get existing cache
      const cacheData = await SecureStorage.getItem(
        SecureStorageKey.CACHED_GEOCODED_ADDRESSES,
      );
      const cache: Record<string, CachedGeocodedAddress> = cacheData
        ? JSON.parse(cacheData)
        : {};

      // Add new entry
      cache[coordinateKey] = {
        coordinateKey,
        addresses,
        cachedAt: Date.now(),
      };

      // Save back to storage
      await SecureStorage.setItem(
        SecureStorageKey.CACHED_GEOCODED_ADDRESSES,
        JSON.stringify(cache),
      );

      this.logger.debug(`Cached geocoded address for key ${coordinateKey}`);
    } catch (error) {
      this.logger.exception(error as Error, "Failed to cache geocoded address");
      // Don't throw - caching failure shouldn't break the app
    }
  }

  /**
   * Retrieves cached geocoded addresses for given coordinates.
   * @param coords The coordinates to look up
   * @returns Cached addresses or null if not found or expired
   */
  private static async getCachedGeocodedAddress(
    coords: Coordinates,
  ): Promise<Location.LocationGeocodedAddress[] | null> {
    try {
      const coordinateKey = this.generateCoordinateKey(coords);

      const cacheData = await SecureStorage.getItem(
        SecureStorageKey.CACHED_GEOCODED_ADDRESSES,
      );
      if (!cacheData) {
        return null;
      }

      const cache: Record<string, CachedGeocodedAddress> =
        JSON.parse(cacheData);
      const entry = cache[coordinateKey];

      if (!entry) {
        this.logger.debug(`No cached address found for key ${coordinateKey}`);
        return null;
      }

      // Check if cache is still valid
      const age = Date.now() - entry.cachedAt;
      if (age > this.GEOCODE_CACHE_EXPIRY_MS) {
        this.logger.debug(`Cached address expired for key ${coordinateKey}`);
        return null;
      }

      this.logger.debug(`Retrieved cached address for key ${coordinateKey}`);
      return entry.addresses as Location.LocationGeocodedAddress[];
    } catch (error) {
      this.logger.exception(
        error as Error,
        "Failed to get cached geocoded address",
      );
      return null;
    }
  }

  /**
   * Clears all cached geocoded addresses.
   */
  static async clearGeocodedAddressCache(): Promise<void> {
    try {
      await SecureStorage.removeItem(
        SecureStorageKey.CACHED_GEOCODED_ADDRESSES,
      );
      this.logger.debug("Geocoded address cache cleared");
    } catch (error) {
      this.logger.exception(
        error as Error,
        "Failed to clear geocoded address cache",
      );
    }
  }

  /**
   * Reverse geocodes coordinates to get address information.
   * Uses caching to reduce API costs and improve performance.
   * @param coords The coordinates to reverse geocode
   * @returns Array of address objects
   */
  static async reverseGeocode(
    coords: Coordinates,
  ): Promise<Location.LocationGeocodedAddress[]> {
    try {
      this.logger.debug(
        `Reverse geocoding coordinates: ${coords.latitude}, ${coords.longitude}`,
      );

      // Check cache first
      const cached = await this.getCachedGeocodedAddress(coords);
      if (cached) {
        this.logger.debug("Returning cached geocoded address");
        return cached;
      }

      // Cache miss - call API
      this.logger.debug("Cache miss, calling reverse geocoding API");
      const addresses = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      this.logger.debug(`Found ${addresses.length} addresses`);

      // Cache the result
      await this.cacheGeocodedAddress(coords, addresses);

      return addresses;
    } catch (error) {
      this.logger.exception(error as Error, "Failed to reverse geocode");
      throw error;
    }
  }

  /**
   * Formats an address object into a human-readable string.
   * @param address The address object from reverse geocoding
   * @returns Formatted address string
   */
  static formatAddress(address: Location.LocationGeocodedAddress): string {
    const parts = [
      address.street,
      address.city,
      address.region,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  }

  // ==================== Saved Locations Management ====================

  /**
   * Saves a location with a name and optional description.
   * @param name Name for the location
   * @param description Optional description
   * @param position The position to save (if not provided, uses current position)
   * @returns The saved location
   */
  static async saveLocation(
    name: string,
    description?: string,
    position?: GeolocationPosition,
  ): Promise<SavedLocation> {
    try {
      this.logger.debug(`Saving location "${name}"`);

      // If no position provided, get current position
      const locationPosition = position || (await this.getCurrentPosition());

      const savedLocation: SavedLocation = {
        id: this.generateId(),
        name,
        description,
        position: locationPosition,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Get existing saved locations
      const savedLocations = await this.getSavedLocations();
      savedLocations.push(savedLocation);

      // Save to storage
      await SecureStorage.setItem(
        SecureStorageKey.SAVED_LOCATIONS,
        JSON.stringify(savedLocations),
      );

      this.logger.debug(`Location "${name}" saved successfully`);
      return savedLocation;
    } catch (error) {
      this.logger.exception(
        error as Error,
        `Failed to save location "${name}"`,
      );
      throw error;
    }
  }

  /**
   * Retrieves all saved locations.
   * @returns Array of saved locations
   */
  static async getSavedLocations(): Promise<SavedLocation[]> {
    try {
      const saved = await SecureStorage.getItem(
        SecureStorageKey.SAVED_LOCATIONS,
      );
      if (!saved) {
        return [];
      }

      const locations: SavedLocation[] = JSON.parse(saved);
      this.logger.debug(`Retrieved ${locations.length} saved locations`);
      return locations;
    } catch (error) {
      this.logger.exception(error as Error, "Failed to get saved locations");
      return [];
    }
  }

  /**
   * Gets a saved location by ID.
   * @param id The location ID
   * @returns The saved location or null if not found
   */
  static async getSavedLocationById(id: string): Promise<SavedLocation | null> {
    try {
      const locations = await this.getSavedLocations();
      const location = locations.find((loc) => loc.id === id);

      if (location) {
        this.logger.debug(`Found location with ID "${id}"`);
      } else {
        this.logger.debug(`No location found with ID "${id}"`);
      }

      return location || null;
    } catch (error) {
      this.logger.exception(
        error as Error,
        `Failed to get location by ID "${id}"`,
      );
      return null;
    }
  }

  /**
   * Gets a saved location by name.
   * @param name The location name
   * @returns The saved location or null if not found
   */
  static async getSavedLocationByName(
    name: string,
  ): Promise<SavedLocation | null> {
    try {
      const locations = await this.getSavedLocations();
      const location = locations.find(
        (loc) => loc.name.toLowerCase() === name.toLowerCase(),
      );

      if (location) {
        this.logger.debug(`Found location with name "${name}"`);
      } else {
        this.logger.debug(`No location found with name "${name}"`);
      }

      return location || null;
    } catch (error) {
      this.logger.exception(
        error as Error,
        `Failed to get location by name "${name}"`,
      );
      return null;
    }
  }

  /**
   * Updates a saved location's name and/or description.
   * @param id The location ID
   * @param updates Object containing name and/or description to update
   * @returns The updated location or null if not found
   */
  static async updateSavedLocation(
    id: string,
    updates: { name?: string; description?: string },
  ): Promise<SavedLocation | null> {
    try {
      this.logger.debug(`Updating location with ID "${id}"`);

      const locations = await this.getSavedLocations();
      const index = locations.findIndex((loc) => loc.id === id);

      if (index === -1) {
        this.logger.debug(`Location with ID "${id}" not found`);
        return null;
      }

      // Update the location
      if (updates.name !== undefined) {
        locations[index].name = updates.name;
      }
      if (updates.description !== undefined) {
        locations[index].description = updates.description;
      }
      locations[index].updatedAt = Date.now();

      // Save back to storage
      await SecureStorage.setItem(
        SecureStorageKey.SAVED_LOCATIONS,
        JSON.stringify(locations),
      );

      this.logger.debug(`Location updated successfully`);
      return locations[index];
    } catch (error) {
      this.logger.exception(
        error as Error,
        `Failed to update location with ID "${id}"`,
      );
      throw error;
    }
  }

  /**
   * Deletes a saved location by ID.
   * @param id The location ID
   * @returns True if deleted, false if not found
   */
  static async deleteSavedLocation(id: string): Promise<boolean> {
    try {
      this.logger.debug(`Deleting location with ID "${id}"`);

      const locations = await this.getSavedLocations();
      const filteredLocations = locations.filter((loc) => loc.id !== id);

      if (filteredLocations.length === locations.length) {
        this.logger.debug(`Location with ID "${id}" not found`);
        return false;
      }

      // Save back to storage
      await SecureStorage.setItem(
        SecureStorageKey.SAVED_LOCATIONS,
        JSON.stringify(filteredLocations),
      );

      this.logger.debug(`Location deleted successfully`);
      return true;
    } catch (error) {
      this.logger.exception(
        error as Error,
        `Failed to delete location with ID "${id}"`,
      );
      throw error;
    }
  }

  /**
   * Clears all saved locations.
   */
  static async clearSavedLocations(): Promise<void> {
    try {
      await SecureStorage.removeItem(SecureStorageKey.SAVED_LOCATIONS);
      this.logger.debug("All saved locations cleared");
    } catch (error) {
      this.logger.exception(error as Error, "Failed to clear saved locations");
    }
  }

  /**
   * Finds saved locations within a certain radius of given coordinates.
   * @param coords The center coordinates
   * @param radiusMeters The search radius in meters
   * @returns Array of saved locations within the radius
   */
  static async findLocationsNearby(
    coords: Coordinates,
    radiusMeters: number,
  ): Promise<SavedLocation[]> {
    try {
      const locations = await this.getSavedLocations();
      const nearby = locations.filter((location) => {
        const distance = this.calculateDistance(
          coords,
          location.position.coords,
        );
        return distance <= radiusMeters;
      });

      this.logger.debug(
        `Found ${nearby.length} locations within ${radiusMeters}m`,
      );
      return nearby;
    } catch (error) {
      this.logger.exception(error as Error, "Failed to find nearby locations");
      return [];
    }
  }

  /**
   * Generates a unique ID for saved locations.
   * @returns A unique ID string
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
