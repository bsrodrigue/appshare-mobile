# EnvService

A fully static environment variable manager for the Elite-app that validates required variables at application start and exposes them through a predictable API.

## Features

✅ **Startup Validation** - Checks for missing env vars at application start  
✅ **Clear Error Messages** - Provides detailed feedback on missing/invalid variables  
✅ **Fully Static** - No instance needed, all methods and getters are static  
✅ **Type-Safe** - Leverages Zod for runtime validation and TypeScript for compile-time safety  
✅ **Predictable API** - Access variables through clean static getters

## Quick Start

### 1. Initialize at App Start

Call `EnvService.init()` in your app's entry point (e.g., `app/_layout.tsx` or `App.tsx`):

```typescript
import EnvService from '@/libs/env';

export default function RootLayout() {
  // Initialize and validate environment variables
  try {
    EnvService.init();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }

  return (
    // ... your app layout
  );
}
```

### 2. Access Environment Variables

After initialization, access env vars through static getters:

```typescript
import EnvService from "@/libs/env";

// Google Maps API Key
const mapsKey = EnvService.GOOGLE_MAPS_API_KEY;

// OneSignal App ID
const oneSignalId = EnvService.ONESIGNAL_APP_ID;

// Optional variables
const apiUrl = EnvService.API_URL; // string | undefined

// Environment checks
if (EnvService.isDevelopment) {
  console.log("Running in dev mode");
}
```

## Available Environment Variables

### Required Variables

These must be present in your `.env` file:

- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (public)
- `GOOGLE_MAPS_API_KEY` - Google Maps API key (fallback)
- `ONESIGNAL_APP_ID` - OneSignal application ID

### Optional Variables

- `GOOGLE_MAPS_API_KEY_IOS` - iOS-specific Google Maps API key
- `EXPO_PUBLIC_API_URL` - Backend API base URL
- `EXPO_PUBLIC_PUSHER_KEY` - Pusher API key
- `EXPO_PUBLIC_PUSHER_CLUSTER` - Pusher cluster

## API Reference

### Static Methods

#### `EnvService.init(): void`

Initializes and validates all environment variables. Must be called at application start.

**Throws:**

- `Error` if required environment variables are missing or invalid

**Example:**

```typescript
EnvService.init();
```

#### `EnvService.getAll(): Readonly<Env>`

Returns all environment variables as a read-only object. Use sparingly; prefer specific getters.

**Example:**

```typescript
const allEnvVars = EnvService.getAll();
```

### Static Getters

#### `EnvService.GOOGLE_MAPS_API_KEY: string`

Returns the Google Maps API key (prefers `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`, falls back to `GOOGLE_MAPS_API_KEY`).

#### `EnvService.GOOGLE_MAPS_API_KEY_IOS: string | undefined`

Returns the iOS-specific Google Maps API key if configured.

#### `EnvService.ONESIGNAL_APP_ID: string`

Returns the OneSignal application ID.

#### `EnvService.API_URL: string | undefined`

Returns the backend API base URL if configured.

#### `EnvService.PUSHER_KEY: string | undefined`

Returns the Pusher API key if configured.

#### `EnvService.PUSHER_CLUSTER: string | undefined`

Returns the Pusher cluster if configured.

#### `EnvService.isDevelopment: boolean`

Returns `true` if running in development mode.

#### `EnvService.isProduction: boolean`

Returns `true` if running in production mode.

## Error Handling

### Missing Environment Variables

If required environment variables are missing, `init()` will throw a clear error:

```
❌ Environment variable validation failed:
  - ONESIGNAL_APP_ID: OneSignal App ID is required
  - EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: Google Maps API key is required

Please check your .env file and ensure all required variables are set.
```

### Accessing Before Initialization

If you try to access env vars before calling `init()`, you'll get:

```
Error: EnvService has not been initialized. Call EnvService.init() at application start.
```

### Cannot Instantiate

The class is fully static and cannot be instantiated:

```typescript
const service = new EnvService(); // ❌ Error: EnvService is a static class and cannot be instantiated
```

## Adding New Environment Variables

1. Add the variable to the `envSchema` in `libs/env/index.ts`:

```typescript
const envSchema = z.object({
  // ... existing variables
  MY_NEW_VAR: z.string().min(1, "My new variable is required"),
  MY_OPTIONAL_VAR: z.string().optional(),
});
```

2. Add a static getter for the variable:

```typescript
/**
 * My new variable description
 */
public static get MY_NEW_VAR(): string {
  this.ensureInitialized();
  return this.env!.MY_NEW_VAR;
}
```

3. Add the variable to your `.env` file:

```
MY_NEW_VAR=my-value
```

## Best Practices

1. **Always call `init()` first** - Call it in your app's entry point before any other code runs
2. **Use specific getters** - Prefer `EnvService.GOOGLE_MAPS_API_KEY` over `EnvService.getAll()`
3. **Handle optional variables** - Check for `undefined` when using optional env vars
4. **Don't instantiate** - The class is fully static; use static methods and getters only
5. **Validate early** - Let the app fail fast at startup if env vars are missing

## Migration from Old EnvService

**Old usage:**

```typescript
const env = EnvService.getInstance().getEnv();
const key = env.MAPS_API_KEY;
```

**New usage:**

```typescript
// At app start:
EnvService.init();

// Anywhere in your code:
const key = EnvService.GOOGLE_MAPS_API_KEY;
```
