import { useCallback, useEffect, useState } from 'react';
import * as LocationService from 'expo-location';
import { locationOffsetAtom } from '@/store/locationOffset.atom';
import { useAtom } from 'jotai';
import Toast from 'react-native-toast-message';

const offsetMove = 20 / 111_111; // 20 meters in degrees for debug movement

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
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [offset, setOffset] = useAtom(locationOffsetAtom);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: LocationService.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await LocationService.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          Toast.show({
            type: 'error',
            text1: 'Brak dostępu do lokalizacji.',
            text2: 'Proszę sprawdzić ustawienia aplikacji.',
            position: 'top',
          });
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
        console.error('Unable to establish user location.', error);
        Toast.show({
          type: 'error',
          text1: 'Nie można ustalić lokalizacji użytkownika.',
          text2: 'Proszę sprawdzić ustawienia lokalizacji.',
          position: 'top',
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      subscription?.remove();
      subscription = null;
    };
  }, []);

  const moveOffsetSouth = useCallback(() => {
    setOffset((prevOffset) => [prevOffset[0] - offsetMove, prevOffset[1]]);
  }, [setOffset]);

  const moveOffsetNorth = useCallback(() => {
    setOffset((prevOffset) => [prevOffset[0] + offsetMove, prevOffset[1]]);
  }, [setOffset]);

  const moveOffsetEast = useCallback(() => {
    setOffset((prevOffset) => [prevOffset[0], prevOffset[1] + offsetMove]);
  }, [setOffset]);

  const moveOffsetWest = useCallback(() => {
    setOffset((prevOffset) => [prevOffset[0], prevOffset[1] - offsetMove]);
  }, [setOffset]);

  const resetOffset = useCallback(() => {
    setOffset([0, 0]);
  }, [setOffset]);

  const locationWithOffset = (
    location && offset
      ? ([location[0] + offset[0], location[1] + offset[1]] as [number, number])
      : location
  ) as [number, number];

  return {
    isLoading,
    location: locationWithOffset,
    moveOffsetSouth,
    moveOffsetNorth,
    moveOffsetEast,
    moveOffsetWest,
    resetOffset,
  };
}
