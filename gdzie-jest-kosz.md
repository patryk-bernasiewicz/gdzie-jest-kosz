# Gdzie Jest Kosz - Project Documentation

This document contains key information regarding the "Gdzie Jest Kosz" mobile application project.

## 1. Project Overview

- **Purpose**: A mobile application to help users, particularly dog owners, locate nearby trash bins, especially for pet waste.
- **Target Audience**: Dog owners.
- **Problem Solved**: Facilitates the location of the nearest trash bins.

## 2. Technology Stack

### Technologies Used:

- **Mobile App Framework**: React Native with Expo.
- **Maps**: Leaflet (using Open Street Map tiles).
- **Authentication**: Clerk.
- **Language**: TypeScript.
- **Geolocation**: Native APIs for fetching geolocation data.

### CI/CD and Hosting:

- No CI/CD pipelines or hosting platforms are in place (as of 2025-05-06).

## 3. Project Structure

The project's code is organized based on features. Main modules/features are located in the `feature/` directory:

- `feature/auth`: Responsible for user authentication (Clerk integration).
- `feature/bins`: Logic related to trash bins (fetching, adding, marking as invalid).
- `feature/map`: Map components and logic (Leaflet), displaying bins, user location.
- `feature/user`: User profile management.

Reusable UI components are located in the `ui/components` directory.

## 4. Database Schema

_(Section to be completed. At this stage, if there is no backend database defined yet, this can be noted. If there are local data structures, e.g., in AsyncStorage, they can be described here.)_

**Example (if applicable):**

Currently, the application does not use a dedicated backend database. User data (obtained from Clerk) and preferences may be stored locally.

## 5. Database Migrations

_(Section to be completed when a backend database and migration system are introduced.)_

## 6. Key Architectural Decisions

- **Feature-based Structure**: The code is modular, facilitating development and testing.
- **Global State Management**: Zustand is used for managing global client-side state.
- **TypeScript**: Usage of types to enhance code safety and quality.

## 7. Coding Conventions

- **Language**: TypeScript.
- **Semicolons**: Mandatory.
- **Quotes**: Single quotes preferred, unless backticks are more appropriate. Double quotes for JSX attributes.
- **Comments**: Avoid unless absolutely necessary to explain complex code segments (comments in English).

## 8. Testing

- **Framework**: Testing Library for React Native.
- **Priority**: Integration tests. Unit tests for complex components.
- **Tools**: `await waitFor(() => {})` instead of `act` for asynchronous operations in tests.

## 9. Future Development (Roadmap / Backlog)

_(Section to be completed with planned features or main development directions)._

---

_Document last updated: 2025-05-06_
