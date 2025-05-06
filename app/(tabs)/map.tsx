import { StyleSheet, View } from 'react-native';

import LeafletMap from '@/feature/map/components/LeafletMap';
import useLocation from '@/feature/map/hooks/useLocation';
import getColor from '@/ui/utils/getColor';

export default function MapScreen() {
  const { location } = useLocation();

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <LeafletMap latitude={location?.[0]} longitude={location?.[1]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    width: '100%',
    padding: 0,
    margin: 0,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: getColor('mapBackground'),
    width: '100%',
  },
});
