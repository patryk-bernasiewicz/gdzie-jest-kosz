import { useSession, useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Heading from '@/ui/components/Heading';
import ScreenWrapper from '@/ui/components/ScreenWrapper';
import Text from '@/ui/components/Text';
import TouchableOpacityButton from '@/ui/components/TouchableOpacityButton';
import TextInput from '@/ui/components/input/TextInput';
import getColor from '@/ui/utils/getColor';
import { handleApiError } from '@/ui/utils/toastNotifications';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { session } = useSession();

  const [isPending, setPending] = useState(false);
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (!isLoaded || !session) {
      return;
    }

    (async () => {
      router.replace('/(tabs)/profile');
    })();
  }, [isLoaded, router, session]);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setPending(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      handleApiError(err, {
        context: 'logowania',
        defaultErrorTitle: 'Nie można zalogować',
        defaultErrorMessage: 'Sprawdź poprawność danych logowania lub spróbuj ponownie później.',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.contentContainer}>
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
        <Link href="/(tabs)/sign-up">
          <Text style={styles.link}>Zarejestruj się</Text>
        </Link>
      </View>
      <View style={styles.clerkInfo}>
        <Text>Bezpieczne logowanie i rejestracja z systemem Clerk.</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
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
