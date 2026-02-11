import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "AppShare",
  slug: "appshare",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "appshare",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
    },
    entitlements: {
      "aps-environment": "development",
      "com.apple.security.application-groups": ["group.com.appshare.onesignal"],
    },
    bundleIdentifier: "com.appshare",
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    package: "com.appshare",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    // [
    //   "onesignal-expo-plugin",
    //   {
    //     mode: "development",
    //   },
    // ],
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "L'application utilise votre localisation pour suivre vos livraisons en temps réel.",
        locationAlwaysPermission:
          "L'application utilise votre localisation en arrière-plan pour suivre vos livraisons.",
        locationWhenInUsePermission:
          "L'application utilise votre localisation pour afficher votre position sur la carte.",
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      // projectId: "76708480-f123-4cd3-9de9-d26e83a654e6",
    },
    // Environment variables baked into the app at build time
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    GOOGLE_MAPS_DIRECTIONS_BASE_URL:
      process.env.EXPO_PUBLIC_GOOGLE_MAPS_DIRECTIONS_BASE_URL,
    GOOGLE_MAPS_API_KEY_IOS: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS,
    ONESIGNAL_APP_ID: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    PUSHER_KEY: process.env.EXPO_PUBLIC_PUSHER_KEY,
    PUSHER_CLUSTER: process.env.EXPO_PUBLIC_PUSHER_CLUSTER,
  },
  owner: "bsrodrigue",
});
