# Elite App

A comprehensive multi-role mobile application built with Expo and React Native, featuring e-commerce, job seeking, delivery services, pharmacy locator, and influencer marketplace functionalities.

## Overview

Elite App is a modern, full-featured mobile platform that serves multiple user roles including clients, sellers, delivery personnel, job publishers, and administrators. The application provides a seamless experience for shopping, job seeking, delivery management, and more, all within a single unified platform.

## Key Features

### 🛍️ E-Commerce & Shopping
- **Product Feed**: Social media-style product browsing with infinite scroll
- **Multi-Vendor Cart**: Support for purchasing from multiple shops simultaneously
- **Real-time Cart Management**: Add, update, and remove items with instant feedback
- **Category Filtering**: Browse products by categories with tab navigation
- **Search & Filters**: Advanced product search with debounced input
- **Order Management**: Complete order lifecycle from checkout to delivery tracking
- **Delivery Options**: Choose between pickup and home delivery per shop

### 💼 Job Seeking Platform
- **Job Listings**: Browse available job opportunities
- **Job Applications**: Apply for jobs with application tracking
- **Application History**: View and manage submitted applications

### 🚚 Delivery Services
- **Delivery Requests**: Request delivery services for items
- **Delivery Tracking**: Real-time tracking of delivery status
- **Delivery History**: View past delivery requests and status
- **Driver Management**: For delivery personnel to manage their deliveries

### 💊 Pharmacy Locator
- **Pharmacy Listings**: Find nearby pharmacies
- **Pharmacy Details**: View pharmacy information, contact details, and location
- **Map Integration**: Interactive maps for pharmacy locations

### 🎯 Influencer Marketplace
- **Influencer Exchange**: Platform for influencer services and collaborations
- **Influencer Home**: Dashboard for influencer activities

### 🔐 Authentication & User Management
- **Multi-Role Authentication**: Support for Client, Seller, Delivery Driver, Job Publisher, and Admin roles
- **OTP Verification**: Secure phone number verification
- **Role-Based Access**: Different interfaces and permissions per user role
- **Secure Storage**: Token management with expo-secure-store

### 🎨 Modern UI/UX
- **Dark Theme**: Beautiful dark-themed interface
- **Skeleton Loaders**: Smooth loading states with skeleton placeholders
- **Toast Notifications**: User-friendly feedback messages
- **Haptic Feedback**: Enhanced touch interactions
- **Safe Area Support**: Proper handling of device notches and system UI
- **Responsive Design**: Optimized for various screen sizes

## Tech Stack

### Core Framework
- **Expo**: ~54.0.30 (SDK 54)
- **React**: 19.1.0
- **React Native**: 0.81.5
- **TypeScript**: ~5.9.2
- **Expo Router**: ~6.0.21 (File-based routing)

### State Management & Data
- **Zustand**: ^5.0.9 (Global state management)
- **React Hook Form**: ^7.68.0 (Form handling)
- **Zod**: ^4.1.13 (Schema validation)
- **Axios**: ^1.13.2 (HTTP client)

### UI & Styling
- **Expo Vector Icons**: ^15.0.3
- **Expo Image**: ~3.0.11 (Optimized image component)
- **Expo Linear Gradient**: ~15.0.8
- **React Native Skeleton Placeholder**: ^5.2.4
- **React Native Toast Message**: ^2.3.3

### Navigation & Gestures
- **React Navigation**: ^7.1.8
- **React Native Gesture Handler**: ~2.28.0
- **React Native Reanimated**: ~4.1.1 (Animations)
- **React Native Screens**: ~4.16.0

### Device Features
- **Expo Location**: ~19.0.8
- **Expo Image Picker**: ~17.0.10
- **Expo Document Picker**: ~14.0.8
- **Expo Haptics**: ~15.0.8
- **React Native Maps**: 1.20.1

### Storage
- **Expo Secure Store**: ~15.0.8 (Encrypted storage)
- **AsyncStorage**: ^2.2.0 (Local storage)

## Project Architecture

### Directory Structure

```
Elite-app/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root layout with auth verification
│   ├── loading.tsx              # Loading screen during auth check
│   ├── (auth)/                  # Public routes (unauthenticated)
│   │   ├── auth.tsx            # Login/Register screen
│   │   └── otp.tsx             # OTP verification
│   └── (protected)/            # Protected routes (authenticated)
│       ├── (client)/           # Client-specific routes
│       │   ├── home.tsx        # Client dashboard
│       │   ├── shops/          # Shopping screens
│       │   │   └── index.tsx   # Product feed
│       │   ├── orders/         # Order management
│       │   ├── jobs/           # Job seeking
│       │   ├── pharmacy/       # Pharmacy locator
│       │   └── delivery-*.tsx  # Delivery screens
│       ├── (seller)/           # Seller dashboard and management
│       ├── (delivery_man)/     # Delivery driver interface
│       ├── (job_publisher)/    # Job publisher interface
│       └── (admin)/            # Admin panel
│
├── features/                    # Feature modules (domain logic)
│   ├── auth/                   # Authentication
│   │   ├── api.ts             # Auth API calls
│   │   ├── hooks.ts           # Auth hooks
│   │   └── types.ts           # Auth types
│   ├── products/               # Product management
│   ├── cart/                   # Shopping cart
│   ├── orders/                 # Order processing
│   ├── shops/                  # Shop management
│   ├── jobs/                   # Job listings
│   ├── deliveries/             # Delivery services
│   ├── pharmacies/             # Pharmacy data
│   ├── product-categories/     # Category management
│   └── shared/                 # Shared utilities
│
├── ui/                         # UI components
│   ├── theme/                  # Theme configuration
│   │   └── index.ts           # Colors, spacing, typography
│   └── use-cases/             # Feature-specific components
│       ├── auth/              # Auth UI components
│       ├── shop/              # Shopping components
│       │   ├── ProductFeedCard.tsx
│       │   ├── CategoryTabs.tsx
│       │   ├── OrderDrawer.tsx
│       │   └── FiltersModal.tsx
│       ├── delivery/          # Delivery components
│       ├── jobseeking/        # Job seeking components
│       ├── pharmacy/          # Pharmacy components
│       └── shared/            # Shared UI components
│
├── libs/                       # Core libraries
│   ├── api/                   # API service layer
│   │   └── client.ts         # APIService singleton
│   ├── http/                  # HTTP client
│   │   └── client.ts         # HTTPClient with interceptors
│   ├── secure-storage/        # Encrypted storage
│   ├── local-storage/         # AsyncStorage wrapper
│   ├── notification/          # Toast notifications
│   └── log/                   # Logging utilities
│
├── store/                      # Zustand stores
│   └── auth/                  # Auth state management
│       └── index.ts          # User, isAuthenticated, tokens
│
├── types/                      # TypeScript type definitions
│   ├── auth.ts               # Auth types
│   ├── role.ts               # User roles
│   ├── schemas.ts            # Zod schemas
│   └── errors.ts             # Error types
│
├── constants/                  # App constants
│   ├── index.ts              # API_BASE_URL, etc.
│   ├── auth.ts               # Auth constants
│   └── routes.ts             # Route constants
│
├── hooks/                      # Global custom hooks
│   └── useCall.ts            # Generic API call hook
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md        # Architecture overview
│   ├── MOBILE_SHOP_SPEC.md   # Shop module specification
│   ├── UX_RESEARCH_*.md      # UX research documents
│   └── QUICK_DESIGN_GUIDE.md # Design guidelines
│
└── assets/                     # Static assets
    └── images/                # App icons, splash screens
```

### Architecture Layers

The application follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        SCREENS (app/)                        │
│         File-based routing with role-based grouping          │
└─────────────────────────┬───────────────────────────────────┘
                          │ uses
┌─────────────────────────▼───────────────────────────────────┐
│                   COMPONENTS (ui/)                           │
│            Feature-specific UI components                    │
└─────────────────────────┬───────────────────────────────────┘
                          │ uses
┌─────────────────────────▼───────────────────────────────────┐
│                    HOOKS (features/*/hooks.ts)               │
│   useCall pattern: { data, execute, isLoading, error }      │
└─────────────────────────┬───────────────────────────────────┘
                          │ calls
┌─────────────────────────▼───────────────────────────────────┐
│                 FEATURE API (features/*/api.ts)              │
│         Domain-specific API functions                        │
└─────────────────────────┬───────────────────────────────────┘
                          │ uses
┌─────────────────────────▼───────────────────────────────────┐
│                 API SERVICE (libs/api/client.ts)             │
│              APIService.getClient() → HTTPClient             │
└─────────────────────────┬───────────────────────────────────┘
                          │ wraps
┌─────────────────────────▼───────────────────────────────────┐
│                HTTP CLIENT (libs/http/client.ts)             │
│         Axios with auto-inject Bearer token                  │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- **Node.js**: LTS version (18.x or higher recommended)
- **npm** or **yarn**: Package manager
- **Expo CLI**: Installed globally (`npm install -g expo-cli`)
- **Development Environment**:
  - iOS: macOS with Xcode and iOS Simulator
  - Android: Android Studio with Android Emulator
  - Physical Device: Expo Go app from App Store/Play Store

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd Elite-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env and add your API keys
```

Required environment variables:
- `GOOGLE_MAPS_API_KEY_IOS`: Google Maps API key for iOS
- `GOOGLE_MAPS_API_KEY_ANDROID`: Google Maps API key for Android

### Running the App

**Start the development server**:
```bash
npm start
```

**Platform-specific commands**:
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

**Using Expo Go** (recommended for quick testing):
1. Install Expo Go on your mobile device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

## Development Guide

### Adding New Features

1. **Create feature module** in `features/`:
```typescript
// features/my-feature/
├── api.ts      // API functions
├── hooks.ts    // Custom hooks using useCall
└── types.ts    // TypeScript types
```

2. **Create UI components** in `ui/use-cases/my-feature/`

3. **Add screens** in appropriate `app/(protected)/(role)/` directory

4. **Update types** in `types/` if needed

### API Integration Pattern

The app uses a consistent pattern for API calls:

```typescript
// 1. Define API function (features/*/api.ts)
export async function getProducts(params: GetProductsParams) {
  const client = APIService.getClient();
  const response = await client.get('/products/search', { params });
  return response.data;
}

// 2. Create hook (features/*/hooks.ts)
export function useSearchProducts(options?: UseCallOptions) {
  return useCall<GetProductsResponse, GetProductsParams>({
    fn: getProducts,
    ...options,
  });
}

// 3. Use in component
const { data, execute, isLoading } = useSearchProducts({
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
});

// Call the API
execute({ search: 'keyword', category_id: 1 });
```

### State Management

**Global State** (Zustand):
- Authentication state (`store/auth/`)
- User information
- Tokens

**Local State** (React hooks):
- Component-specific state
- Form state (React Hook Form)
- API call state (useCall hook)

### Navigation

The app uses **Expo Router** with file-based routing:

```typescript
// Navigate programmatically
import { router } from 'expo-router';

router.push('/(protected)/(client)/shops');
router.back();

// Get route parameters
import { useLocalSearchParams } from 'expo-router';
const { id } = useLocalSearchParams<{ id: string }>();
```

### Styling

The app uses a centralized theme system:

```typescript
import { theme } from '@/ui/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.md,
  },
});
```

### Form Validation

Forms use **React Hook Form** with **Zod** schemas:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/types/schemas';

const { control, handleSubmit } = useForm({
  resolver: zodResolver(loginSchema),
});
```

## Testing & Quality

### Linting

```bash
npm run lint
```

The project uses ESLint with Expo's recommended configuration.

### Type Checking

TypeScript is configured for strict type checking. Run type checks:

```bash
npx tsc --noEmit
```

## Building for Production

### Prerequisites

Set up **EAS Build**:
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Android

```bash
# Development build
eas build --platform android --profile development

# Production build (AAB for Play Store)
eas build --platform android --profile production
```

### iOS

```bash
# Development build
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production
```

## Configuration

### App Configuration

Edit `app.config.ts` to customize:
- App name and slug
- Version
- Icons and splash screens
- Platform-specific settings
- Plugins

### API Configuration

API base URL is configured in `constants/index.ts`:
```typescript
export const CONSTANTS = {
  API_BASE_URL: 'https://your-api-url.com',
};
```

## Troubleshooting

### Common Issues

**Metro bundler cache issues**:
```bash
npx expo start -c
```

**Module resolution errors**:
```bash
rm -rf node_modules
npm install
```

**iOS build issues**:
```bash
cd ios
pod install
cd ..
```

**Android build issues**:
```bash
cd android
./gradlew clean
cd ..
```

## Documentation

Additional documentation is available in the `docs/` directory:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Detailed architecture overview
- **[MOBILE_SHOP_SPEC.md](docs/MOBILE_SHOP_SPEC.md)**: Complete shop module specification
- **[UX_RESEARCH_SHOP_REDESIGN.md](docs/UX_RESEARCH_SHOP_REDESIGN.md)**: UX research for shop redesign
- **[QUICK_DESIGN_GUIDE.md](docs/QUICK_DESIGN_GUIDE.md)**: Design guidelines

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the project conventions
3. Run linting and type checks
4. Test on both iOS and Android
5. Submit a pull request with a clear description

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Hook Form Documentation](https://react-hook-form.com/)

## License

[Add your license here]

## Support

For issues and questions, please open an issue in the repository.
