import { isClerkRuntimeError, useSession, useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuthToken } from '@/feature/auth/store/authToken.atom';
import Heading from '@/ui/components/Heading';
import Text from '@/ui/components/Text';
import TouchableOpacityButton from '@/ui/components/TouchableOpacityButton';
import TextInput from '@/ui/components/input/TextInput';
import { getColor } from '@/ui/utils/getColor';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: getColor('background'),
    flex: 1,
    padding: 20,
  },
  link: {
    color: getColor('primary'),
    fontWeight: 600,
  },
  newAccount: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    marginTop: 10,
  },
  clerkInfo: {
    marginTop: 10,
  },
});

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { session } = useSession();
  const [, setAuthToken] = useAuthToken();

  const [isPending, setPending] = useState(false);
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (!isLoaded || !session) return;

    (async () => {
      const token = await session.getToken();
      if (token) {
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }

      router.replace('/profile');
    })();
  }, [isLoaded, router, session, setAuthToken]);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    setPending(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));

      if (isClerkRuntimeError(err) && err.code === 'network_error') {
        console.error('Network error occurred!');
        Toast.show({
          type: 'error',
          text1: 'Błąd sieci',
          text2: err.message ?? 'Sprawdź połączenie z internetem',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Nie można zalogować',
          text2: (err as Error).message ?? 'Sprawdź poprawność danych logowania',
        });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Heading text="Zaloguj się" />
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Adres e-mail"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        label="Adres e-mail"
        disabled={isPending}
      />
      <TextInput
        value={password}
        placeholder="Wpisz hasło"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        label="Hasło"
        disabled={isPending}
      />
      <TouchableOpacityButton
        onPress={onSignInPress}
        text="Kontynuuj"
        variant="primary"
        disabled={isPending}
      />
      <View style={styles.newAccount}>
        <Text>Nie masz jeszcze konta?</Text>
        <Link href="/sign-up">
          <Text style={styles.link}>Zarejestruj się</Text>
        </Link>
      </View>
      <View style={styles.clerkInfo}>
        <Text>Bezpieczne logowanie i rejestracja z systemem Clerk.</Text>
      </View>
    </View>
  );
}
