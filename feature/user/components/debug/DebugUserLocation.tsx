import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/Text';
import useLocation from '@/feature/map/hooks/useLocation';
import { getColor } from '@/lib/getColor';

export default function DebugUserLocation() {
  const { location } = useLocation();

  return (
    <View style={styles.position}>
      <Text>
        Current position:{'\n'}
        {location ? `${location?.[0]}\n${location?.[1]}` : 'unknown'}
        {'\n'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    zIndex: 1,
    backgroundColor: getColor('background'),
    borderWidth: 1,
    borderColor: getColor('border'),
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 5,
  },
});
