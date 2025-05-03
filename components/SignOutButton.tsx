import { getColor } from '@/lib/getColor';
import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignOutButton() {
  const [isPending, setPending] = useState(false);
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    if (isPending) return;

    setPending(true);

    try {
      await signOut();
      Linking.openURL(Linking.createURL('/(tabs)/profile'));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        disabled={isPending}
        onPress={handleSignOut}
        style={{
          ...styles.button,
          ...(isPending ? styles.buttonDisabled : {}),
        }}
      >
        <Text style={styles.buttonText}>Wyloguj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: getColor('primary'),
  },
  buttonDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  buttonText: {
    color: getColor('textInvert'),
  },
});
