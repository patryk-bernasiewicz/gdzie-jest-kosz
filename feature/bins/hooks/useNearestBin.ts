import { useMemo } from 'react';

import getNearestBin from '@/feature/bins/utils/getNearestBin';
import useLocation from '@/feature/map/hooks/useLocation';
import { WorldDirection } from '@/types/WorldDirection';

import { BinWithDistance } from '../types';

export default function useNearestBin(bins?: BinWithDistance[] | null): {
  nearestBin: BinWithDistance | null;
  nearestBinDirection: WorldDirection | null;
} {
  const { location } = useLocation();

  const nearestBin = useMemo(() => {
    if (!bins || bins.length === 0 || !location || !location[0] || !location[1]) return null;

    return getNearestBin(bins, location[0], location[1]);
  }, [bins, location]);

  const nearestBinDirection = useMemo<WorldDirection | null>(() => {
    if (!nearestBin || !location) return null;
    const [latitude, longitude] = location;
    const { latitude: binLat, longitude: binLng } = nearestBin;

    // If the bin and user are at the same coordinates, return 'here'
    if (latitude === binLat && longitude === binLng) {
      return 'here';
    }

    const deltaLng = binLng - longitude;
    const deltaLat = binLat - latitude;
    // Use atan2(deltaLng, deltaLat) so 0° is north
    const angleRadians = Math.atan2(deltaLng, deltaLat);

    let angleDegrees = angleRadians * (180 / Math.PI);
    if (angleDegrees < 0) angleDegrees += 360;

    const directions: WorldDirection[] = [
      'north',
      'northeast',
      'east',
      'southeast',
      'south',
      'southwest',
      'west',
      'northwest',
    ];

    const index = Math.floor(((angleDegrees + 22.5) % 360) / 45) % 8;
    const direction = directions[index];

    return direction as WorldDirection;
  }, [nearestBin, location]);

  return { nearestBin, nearestBinDirection };
}
