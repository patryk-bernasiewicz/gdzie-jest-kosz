import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import calculateDistance from '@/utils/calculateDistance';
import { SIGNIFICANT_LOCATION_CHANGE_METERS } from '../constants/distance';

import useLocation from '@/feature/map/hooks/useLocation';
import api from '@/utils/api';
import { serializeAxiosError } from '@/utils/serializeAxiosError';

import { Bin } from '../types';

const disableFetchingBins = false;

export default function useBins() {
  const { location } = useLocation();
  const [latitude, longitude] = location?.[0] && location?.[1] ? [location[0], location[1]] : [null, null];

  // Store the last location that triggered a fetch
  const lastFetchedLocationRef = useRef<[number, number] | null>(null);
  const [lastFetchedLocation, setLastFetchedLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;
    if (!lastFetchedLocationRef.current) {
      lastFetchedLocationRef.current = [latitude, longitude];
      setLastFetchedLocation([latitude, longitude]);
      return;
    }
    const [lastLat, lastLon] = lastFetchedLocationRef.current;
    const distance = calculateDistance([lastLat, lastLon], [latitude, longitude]);
    if (distance >= SIGNIFICANT_LOCATION_CHANGE_METERS) {
      lastFetchedLocationRef.current = [latitude, longitude];
      setLastFetchedLocation([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const binsUrl =
    lastFetchedLocation && lastFetchedLocation[0] && lastFetchedLocation[1]
      ? `/bins/?latitude=${lastFetchedLocation[0]}&longitude=${lastFetchedLocation[1]}`
      : null;

  return useQuery<Bin[]>({
    queryKey: ['bins', lastFetchedLocation?.[0], lastFetchedLocation?.[1]],
    queryFn: async () => {
      if (!binsUrl) return null;
      try {
        const response = await api.get(binsUrl);
        return response.data;
      } catch (error) {
        console.error('Error fetching bins:', JSON.stringify(serializeAxiosError(error), null, 2));
        throw error;
      }
    },
    enabled: !!binsUrl && !disableFetchingBins,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}
