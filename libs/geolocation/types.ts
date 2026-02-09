export interface Coordinates {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
}

export interface GeolocationPosition {
    coords: Coordinates;
    timestamp: number;
}

export interface SavedLocation {
    id: string;
    name: string;
    description?: string;
    position: GeolocationPosition;
    createdAt: number;
    updatedAt: number;
}

export interface CachedGeolocation {
    position: GeolocationPosition;
    cachedAt: number;
    savedLocations?: SavedLocation[];
}

export interface GeolocationError {
    code: number;
    message: string;
}

export interface GeolocationOptions {
    accuracy?: 'low' | 'balanced' | 'high' | 'highest' | 'best_for_navigation';
    timeInterval?: number;
    distanceInterval?: number;
    timeout?: number;
    maximumAge?: number;
}

export interface CachedGeocodedAddress {
    coordinateKey: string;
    addresses: any[]; // Location.LocationGeocodedAddress[] - using any to avoid expo-location import
    cachedAt: number;
}
