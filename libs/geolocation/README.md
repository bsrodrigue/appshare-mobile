# GeolocationService

A service that wraps Expo's Location API with caching capabilities and named location management using SecureStorage.

## Features

- **Permission Management**: Request and check location permissions
- **Current Position**: Get the device's current location
- **Last Known Position**: Retrieve cached or last known location
- **Caching**: Automatically cache locations to SecureStorage
- **Named Locations**: Save, manage, and retrieve locations with custom names and descriptions
- **Distance Calculation**: Calculate distance between two coordinates using Haversine formula
- **Nearby Search**: Find saved locations within a radius
- **Configurable Accuracy**: Support for different accuracy levels
- **No UI Dependencies**: Pure service layer with no UI code

## Usage

### Request Permissions

```typescript
import { GeolocationService } from '@/libs/geolocation/geolocation';

const permission = await GeolocationService.requestPermissions();
if (permission.status === 'granted') {
  // Permissions granted
}
```

### Get Current Position

```typescript
const position = await GeolocationService.getCurrentPosition({
  accuracy: 'high',
  timeout: 10000,
});

console.log(position.coords.latitude, position.coords.longitude);
```

### Get Last Known Position (with caching)

```typescript
// Returns cached position if less than 5 minutes old
const position = await GeolocationService.getLastKnownPosition();

// Or specify custom max age (in milliseconds)
const position = await GeolocationService.getLastKnownPosition(10 * 60 * 1000); // 10 minutes
```

### Save a Named Location

```typescript
// Save current location with a name
const savedLocation = await GeolocationService.saveLocation(
  'Home',
  'My home address'
);

// Save a specific position
const position = await GeolocationService.getCurrentPosition();
const office = await GeolocationService.saveLocation(
  'Office',
  'Work location',
  position
);

console.log(savedLocation.id); // Unique ID
console.log(savedLocation.name); // "Home"
console.log(savedLocation.description); // "My home address"
console.log(savedLocation.createdAt); // Timestamp
```

### Get All Saved Locations

```typescript
const locations = await GeolocationService.getSavedLocations();
locations.forEach(loc => {
  console.log(`${loc.name}: ${loc.position.coords.latitude}, ${loc.position.coords.longitude}`);
});
```

### Get Saved Location by ID or Name

```typescript
// By ID
const location = await GeolocationService.getSavedLocationById('1234-abcd');

// By name (case-insensitive)
const home = await GeolocationService.getSavedLocationByName('Home');
```

### Update a Saved Location

```typescript
const updated = await GeolocationService.updateSavedLocation('1234-abcd', {
  name: 'New Home',
  description: 'Updated description'
});
```

### Delete a Saved Location

```typescript
const deleted = await GeolocationService.deleteSavedLocation('1234-abcd');
if (deleted) {
  console.log('Location deleted successfully');
}
```

### Find Nearby Saved Locations

```typescript
const currentPosition = await GeolocationService.getCurrentPosition();
const nearby = await GeolocationService.findLocationsNearby(
  currentPosition.coords,
  1000 // 1km radius in meters
);

console.log(`Found ${nearby.length} locations within 1km`);
```

### Calculate Distance

```typescript
const distance = GeolocationService.calculateDistance(
  { latitude: 5.3484, longitude: -4.0305 },
  { latitude: 5.3600, longitude: -4.0400 }
);

console.log(`Distance: ${distance} meters`);
```

### Clear Cache and Saved Locations

```typescript
// Clear position cache
await GeolocationService.clearCache();

// Clear all saved locations
await GeolocationService.clearSavedLocations();
```

## Accuracy Levels

- `low`: Accurate to 3000m
- `balanced`: Accurate to 100m (default)
- `high`: Accurate to 10m
- `highest`: Accurate to ~1m
- `best_for_navigation`: Best accuracy for navigation

## Caching

Positions are automatically cached to SecureStorage when retrieved. The cache includes:
- Position coordinates
- Timestamp when cached
- Automatic expiry (default: 5 minutes)

## Types

All TypeScript types are exported from `types.ts`:
- `Coordinates`: Latitude, longitude, altitude, accuracy, etc.
- `GeolocationPosition`: Position with coordinates and timestamp
- `SavedLocation`: Named location with id, name, description, position, and timestamps
- `CachedGeolocation`: Cached position with cache metadata
- `GeolocationOptions`: Configuration options for location requests

## Saved Location Structure

```typescript
interface SavedLocation {
  id: string;                      // Unique identifier
  name: string;                    // User-defined name
  description?: string;            // Optional description
  position: GeolocationPosition;   // Full position data
  createdAt: number;              // Creation timestamp
  updatedAt: number;              // Last update timestamp
}
```
