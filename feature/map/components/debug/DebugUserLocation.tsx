import { StyleSheet, View } from 'react-native';

import useLocation from '@/feature/map/hooks/useLocation';
import Text from '@/ui/components/Text';
import getColor from '@/ui/utils/getColor';

export default function DebugUserLocation() {
  const { location } = useLocation();

  return (
    <View style={styles.position}>
      <Text style={styles.text}>
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
    bottom: 10,
    left: 5,
    zIndex: 1,
    backgroundColor: getColor('background'),
    borderWidth: 1,
    borderColor: getColor('border'),
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 14,
  },
});
