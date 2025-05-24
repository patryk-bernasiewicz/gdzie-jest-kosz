# Gdzie jest kosz

## Backend project

This app uses Nest.js based backend as a Trash Bin database. It is located [here](https://github.com/patryk-bernasiewicz/gdzie-jest-kosz-backend).

## Project description

A mobile app that allows users to track their location in real-time using Leaflet map and see the trash bins added by them, or their community, in their area. It aims to solve the problem that lots of dog owners have during their walks, when the need comes to dispose of the dog poop, and trash bins are nowhere in the vicinity.

## Technology stack

- React Native with Expo
- TypeScript
- Leaflet (maps)
- Clerk (authentication)
- Zustand (state management)
- React Query (@tanstack/react-query)
- Testing Library for React Native

## Project structure

```text
app/                # Expo Router entry points and navigation (routes as files/folders)
assets/             # Fonts and images
feature/            # Feature-based domain logic (auth, bins, map, user, etc.)
  auth/             # Authentication feature (screens, components, store, etc.)
  bins/             # Trash bin feature (hooks, types, utils, tests, etc.)
  map/              # Map feature (screens, hooks, store, utils, etc.)
  user/             # User profile and related logic (screens, components, hooks, etc.)
scripts/            # Project scripts (e.g., reset-project.js)
types/              # Global TypeScript type definitions
ui/                 # Shared UI primitives, navigation, constants, hooks, and utils
  components/       # Shared UI components (Heading, Text, IconSymbol, etc.)
    input/          # Input primitives (TextInput, etc.)
    navigation/     # Navigation UI (HapticTab, TabBarBackground, etc.)
  constants/        # Shared constants (e.g., Colors)
  hooks/            # Shared hooks (useColorScheme, useThemeColor, etc.)
  utils/            # Shared utility functions (getColor, etc.)
utils/              # App-wide utility functions (api, calculateDistance, etc.)
```

## Setup instructions

1. Clone the repository.
2. Run npm install.
3. Set up your .env file with the required environment variables (see below).
4. Start the backend project (see [the backend](https://github.com/patryk-bernasiewicz/gdzie-jest-kosz-backend) repo).
5. Run the app with `npx expo start`.

## Environment Variables

The app requires the following environment variables for backend API configuration:

- `EXPO_PUBLIC_BACKEND_URL` — The base URL of your backend (e.g., `http://192.168.0.1:3220`)
- `EXPO_PUBLIC_BACKEND_API_PREFIX` — The API prefix (e.g., `api/v1`)

These are automatically joined and normalized by the app. Both must be set, or the app will throw a clear error on startup.

Example `.env`:
```
EXPO_PUBLIC_BACKEND_URL=http://192.168.0.55:3220
EXPO_PUBLIC_BACKEND_API_PREFIX=api/v1
```

## Testing

After installing the dependencies, use `npm run test` to run the test suites.

## Features

- Real-time location tracking
- Real-time trash bin tracking in the user's area
- User authentication with Clerk
- Map integration using Leaflet and OpenStreetMap
- Context menu for submitting new bin locations
- Admin features (e.g., marking bins as invalid)

## Error Handling

All API errors are logged in a detailed, consistent format using a custom utility. This makes debugging network and backend issues much easier. If you add new API queries or mutations, use the `serializeAxiosError` utility from `utils/serializeAxiosError.ts` for consistent error reporting.

## Code Formatting

This project uses Prettier with a print width of 80. Please ensure your editor is configured accordingly to avoid unnecessary diffs.
