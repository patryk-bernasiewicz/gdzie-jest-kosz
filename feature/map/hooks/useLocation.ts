import * as LocationService from 'expo-location';
import { useEffect, useState } from 'react';
import { create } from 'zustand';

import { handleApiError, showErrorToast } from '@/ui/utils/toastNotifications';

const offsetMove = 20 / 111_111; // 20 meters in degrees for debug movement

type LocationOffsetStore = {
  location: [number, number] | null;
  setLocation: (location: [number, number]) => void;
  offset: [number, number];
  moveSouth: () => void;
  moveNorth: () => void;
  moveEast: () => void;
  moveWest: () => void;
  resetOffset: () => void;
};

const useLocationOffsetStore = create<LocationOffsetStore>((set) => ({
  location: [0, 0],
  setLocation: (location: [number, number]) => set({ location }),
  offset: [0, 0],
  moveSouth: () => set((state) => ({ offset: [state.offset[0] - offsetMove, state.offset[1]] })),
  moveNorth: () => set((state) => ({ offset: [state.offset[0] + offsetMove, state.offset[1]] })),
  moveEast: () => set((state) => ({ offset: [state.offset[0], state.offset[1] + offsetMove] })),
  moveWest: () => set((state) => ({ offset: [state.offset[0], state.offset[1] - offsetMove] })),
  resetOffset: () => set({ offset: [0, 0] }),
}));

type UseLocationReturnType = {
  isLoading: boolean;
  location: [number, number];
  moveOffsetSouth: () => void;
  moveOffsetNorth: () => void;
  moveOffsetEast: () => void;
  moveOffsetWest: () => void;
  resetOffset: () => void;
};

export default function useLocation(): UseLocationReturnType {
  const [isLoading, setLoading] = useState(true);
  const { location, setLocation, offset, moveSouth, moveNorth, moveEast, moveWest, resetOffset } =
    useLocationOffsetStore();

  useEffect(() => {
    let subscription: LocationService.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await LocationService.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          showErrorToast(
            'Brak dostępu do lokalizacji.',
            'Proszę sprawdzić ustawienia aplikacji i udzielić uprawnień do lokalizacji.'
          );
          setLoading(false);
          return;
        }
        const location = await LocationService.getCurrentPositionAsync({});

        subscription = await LocationService.watchPositionAsync(
          { accuracy: LocationService.Accuracy.Highest, timeInterval: 2000 },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            setLocation([latitude, longitude]);
          }
        );

        const { latitude, longitude } = location.coords;
        setLocation([latitude, longitude]);
      } catch (error) {
        handleApiError(error, {
          context: 'ustalania lokalizacji',
          defaultErrorTitle: 'Błąd lokalizacji',
          defaultErrorMessage: 'Nie udało się ustalić Twojej lokalizacji. Sprawdź ustawienia GPS.',
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      subscription?.remove();
      subscription = null;
    };
  }, [setLocation]);

  const locationWithOffset = (
    location && offset
      ? ([location[0] + offset[0], location[1] + offset[1]] as [number, number])
      : location
  ) as [number, number];

  return {
    isLoading,
    location: locationWithOffset,
    moveOffsetSouth: moveSouth,
    moveOffsetNorth: moveNorth,
    moveOffsetEast: moveEast,
    moveOffsetWest: moveWest,
    resetOffset,
  };
}
