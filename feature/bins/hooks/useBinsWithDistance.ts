import { useMemo } from 'react';

import useLocation from '@/feature/map/hooks/useLocation';
import calculateDistance from '@/lib/calculateDistance';

import { Bin, BinWithDistance } from '../types';

export default function useBinsWithDistance(bins?: Bin[]) {
  const { location } = useLocation();

  const binsWithDistance = useMemo(() => {
    if (!location || !location[0] || !location[1]) return null;

    if (!bins || bins.length === 0) return [];

    const userLatitude = location[0];
    const userLongitude = location[1];

    return bins.map<BinWithDistance>((bin: Bin) => {
      // don't calculate distance if bin is too far away
      const isCloseEnough =
        Math.abs(bin.latitude - userLatitude) < 0.005 &&
        Math.abs(bin.longitude - userLongitude) < 0.005;

      return {
        ...bin,
        distance: isCloseEnough
          ? calculateDistance([userLatitude, userLongitude], [bin.latitude, bin.longitude])
          : null,
      };
    });
  }, [location, bins]);

  return binsWithDistance;
}
