import { StyleSheet, View } from 'react-native';

import Text from '@/ui/components/Text';
import useDevMode from '@/ui/hooks/useDevMode';
import getColor from '@/ui/utils/getColor';

import { useAuthToken } from '../../hooks/useAuthToken';

export default function TokenDebug() {
  const isDevMode = useDevMode();
  const { token } = useAuthToken();

  if (!isDevMode) {
    return null;
  }

  return (
    <View style={styles.debug} onTouchEnd={() => console.log(`Token: ${token}`)}>
      <Text>Token:</Text>
      <Text>{token ? `${token.slice(0, 12)}...` : 'not found'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  debug: {
    backgroundColor: getColor('background'),
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    position: 'absolute',
    top: 105,
    right: 8,
  },
});
