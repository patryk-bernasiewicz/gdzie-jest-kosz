import { StyleSheet, Text, View } from 'react-native';

import LeafletMap from '@/components/map/LeafletMap';

import useLocation from '@/feature/map/hooks/useLocation';
import useUserProfile from '@/feature/user/hooks/useUserProfile';
import TokenDebug from '@/components/debug/TokenDebug';
import { getColor } from '@/lib/getColor';

export default function HomeScreen() {
  const { location } = useLocation();
  const userProfile = useUserProfile();

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <LeafletMap latitude={location?.[0]} longitude={location?.[1]} />
      </View>
      {userProfile.data && userProfile.data.role === 'admin' ? (
        <View style={styles.position}>
          <Text>
            Current position:{'\n'}
            {location ? `${location?.[0]}\n${location?.[1]}` : 'none'}
            {'\n'}
          </Text>
        </View>
      ) : null}
      <TokenDebug />
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
