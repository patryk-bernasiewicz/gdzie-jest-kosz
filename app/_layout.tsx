import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { plPL } from '@clerk/localizations/pl-PL';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

// TODO: Verify if this is still relevant and necessary.
// eslint-disable-next-line no-undef
if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  window.navigator.onLine = true;
}

const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.warn('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. App may not work correctly.');
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const currentRoute = segments.join('/');
    // Definiujemy osobno "prawdziwe" trasy autentykacji (logowanie/rejestracja)
    const isStrictAuthRoute =
      currentRoute.startsWith('(tabs)/sign-in') || currentRoute.startsWith('(tabs)/sign-up');
    // Definiujemy trasy, które są publicznie dostępne, ale niekoniecznie wymagają wylogowania
    const isPublicishRoute = isStrictAuthRoute || currentRoute.startsWith('(tabs)/privacy-policy');

    if (isSignedIn) {
      if (isStrictAuthRoute) {
        // Zalogowany, ale na stronie logowania/rejestracji -> przekieruj do mapy
        router.replace('/(tabs)/map');
      } else if (segments[0] !== '(tabs)' && !currentRoute.startsWith('(tabs)/privacy-policy')) {
        // Zalogowany, ale poza grupą (tabs) LUB nie na publicznej privacy-policy (np. nieistniejąca ścieżka)
        router.replace('/(tabs)/map');
      }
      // Jeśli zalogowany i na właściwej stronie w (tabs) (np. map, profile, privacy-policy) - nic nie rób
    } else {
      // Niezalogowany
      if (!isPublicishRoute) {
        // Niezalogowany i nie na stronie logowania/rejestracji/polityki prywatności -> przekieruj do sign-in
        router.replace('/(tabs)/sign-in');
      }
      // Jeśli niezalogowany i na jednej z publicishRoute - nic nie rób, jest we właściwym miejscu
    }
  }, [isLoaded, isSignedIn, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={publishableKey || 'temp_key_for_dev'}
      localization={plPL}
    >
      <QueryClientProvider client={queryClient}>
        <InitialLayout />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
