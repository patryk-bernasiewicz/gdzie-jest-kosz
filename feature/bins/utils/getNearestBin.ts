import calculateDistance from '@/lib/calculateDistance';

import { BinWithDistance } from '../types';

export default function getNearestBin(
  bins: BinWithDistance[],
  userLatitude: number,
  userLongitude: number
) {
  if (!bins || bins.length === 0) return null;

  const nearestBin = bins.reduce<BinWithDistance | null>((nearest, bin) => {
    if (!bin.distance) return nearest;

    const currentDistance = calculateDistance(
      [userLatitude, userLongitude],
      [bin.latitude, bin.longitude]
    );

    if (!nearest || !nearest.distance || currentDistance < nearest.distance) {
      return bin;
    }

    return nearest;
  }, null);

  return nearestBin;
}
