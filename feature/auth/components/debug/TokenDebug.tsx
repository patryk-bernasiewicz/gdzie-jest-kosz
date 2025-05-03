import { StyleSheet, View } from 'react-native';

import { useAuthToken } from '@/feature/auth/store/authToken.atom';
import Text from '@/ui/components/Text';
import useDevMode from '@/ui/hooks/useDevMode';
import getColor from '@/ui/utils/getColor';

export default function TokenDebug() {
  const [token] = useAuthToken();
  const isDevMode = useDevMode();

  if (!isDevMode) {
    return null;
  }

  return (
    <View style={styles.debug} onTouchEnd={() => console.log(`Token: ${token}`)}>
      <Text>Token:</Text>
      <Text>{token?.length ? `${token.slice(0, 13)}...` : '-'}</Text>
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
    top: 110,
    right: 20,
  },
});
