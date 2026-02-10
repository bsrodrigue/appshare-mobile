export enum SecureStorageKey {
  // Auth tokens
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  ACCESS_TOKEN_EXPIRES_AT = "access_token_expires_at",
  REFRESH_TOKEN_EXPIRES_AT = "refresh_token_expires_at",

  // Legacy (deprecated - use ACCESS_TOKEN instead)
  /** @deprecated Use ACCESS_TOKEN instead */
  BEARER_TOKEN = "bearer_token",

  // Geolocation
  CACHED_GEOLOCATION = "cached_geolocation",
  SAVED_LOCATIONS = "saved_locations",
  CACHED_DELIVERY_ADDRESSES = "cached_delivery_addresses",
  PENDING_ADDRESS_OPERATIONS = "pending_address_operations",
  CACHED_GEOCODED_ADDRESSES = "cached_geocoded_addresses",
}
