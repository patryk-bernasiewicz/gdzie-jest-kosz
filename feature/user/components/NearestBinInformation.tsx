import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BinWithDistance } from '@/feature/bins/types/BinWithDistance';
import { getColor } from '@/lib/getColor';
import { WorldDirection } from '@/types/WorldDirection';

import Text from '../../../components/ui/Text';

const fallbackText = 'W pobliżu nie znaleziono kosza...';
const nextToYouTreshold = 5.99;

const worldDirectionToLabel: Record<WorldDirection, string> = {
  north: 'na północ stąd',
  northeast: 'na północny wschód stąd',
  northwest: 'na północny zachód stąd',
  south: 'na południe stąd',
  east: 'na wschód stąd',
  west: 'na zachód stąd',
  southeast: 'na południowy wschód stąd',
  southwest: 'na południowy zachód stąd',
  here: '',
};

function getDistanceLabel(distance: number | null): string {
  if (!distance) {
    return 'nie wiadomo jak daleko :(';
  }
  if (distance < nextToYouTreshold) {
    return 'obok Ciebie!';
  }
  return `około ${distance.toFixed(0)} metrów`;
}

function getDirectionLabel(
  distance: number | null | undefined,
  direction: WorldDirection | null | undefined
): string | null {
  if (distance && distance >= nextToYouTreshold && direction) {
    return worldDirectionToLabel[direction];
  }
  return null;
}

type NearestBinInformationProps = {
  nearestBin?: BinWithDistance | null;
  direction?: WorldDirection | null;
};

export default function NearestBinInformation({
  nearestBin,
  direction,
}: NearestBinInformationProps) {
  const distance = nearestBin?.distance ?? null;
  const directionLabel = useMemo(
    () => getDirectionLabel(distance, direction),
    [distance, direction]
  );
  const distanceText = useMemo(() => getDistanceLabel(distance), [distance]);

  const text = useMemo(() => {
    if (nearestBin && distance) {
      return ['Najbliższy kosz jest', distanceText, directionLabel ?? undefined]
        .filter(Boolean)
        .join(' ');
    }
    return fallbackText;
  }, [nearestBin, distance, distanceText, directionLabel]);

  return (
    <View style={styles.container} accessible accessibilityRole="text">
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    paddingTop: 40,
    left: 0,
    right: 0,
    backgroundColor: getColor('background'),
    position: 'absolute',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: getColor('text'),
    textAlign: 'center' as const,
    padding: 10,
  },
});
