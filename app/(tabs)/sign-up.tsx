import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { useSession } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { errorTranslations } from '@/feature/auth/constants/errorTranslations';
import Heading from '@/ui/components/Heading';
import ScreenWrapper from '@/ui/components/ScreenWrapper';
import Text from '@/ui/components/Text';
import TouchableOpacityButton from '@/ui/components/TouchableOpacityButton';
import TextInput from '@/ui/components/input/TextInput';
import getColor from '@/ui/utils/getColor';
import { handleApiError } from '@/ui/utils/toastNotifications';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { session } = useSession();
  const [isPending, setPending] = useState(false);
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<{
    email_address: string | null;
    password: string | null;
    consent_given: string | null;
  }>();
  useEffect(() => {
    if (!isLoaded || !session) return;

    (async () => {
      const token = await session.getToken();
      console.log('Token:', token);
      router.replace('/(tabs)/profile');
    })();
  }, [isLoaded, session, router]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setPending(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const emailError = err.errors.find(({ meta }) => meta?.paramName === 'email_address');
        const emailErrorText =
          errorTranslations[emailError?.code || ''] || emailError?.message || null;
        const passwordError = err.errors.find(({ meta }) => meta?.paramName === 'password');
        const passwordErrorText =
          errorTranslations[passwordError?.code || ''] || passwordError?.message || null;
        setErrors({
          email_address: emailErrorText,
          password: passwordErrorText,
          consent_given: null,
        });
      } else {
        handleApiError(err, {
          context: 'rejestracji',
          defaultErrorTitle: 'Błąd podczas tworzenia konta',
          defaultErrorMessage: 'Wystąpił nieoczekiwany problem. Spróbuj ponownie.',
        });
      }
    } finally {
      setPending(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setPending(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        console.error('[Verification Error]', JSON.stringify(signUpAttempt, null, 2));
        handleApiError(new Error('Weryfikacja nie powiodła się. Status: ' + signUpAttempt.status), {
          context: 'weryfikacji e-mail',
          defaultErrorTitle: 'Błąd weryfikacji',
        });
      }
    } catch (err) {
      handleApiError(err, {
        context: 'weryfikacji e-mail',
        defaultErrorTitle: 'Błąd podczas weryfikacji kodu',
        defaultErrorMessage: 'Wystąpił nieoczekiwany problem. Spróbuj ponownie.',
      });
    } finally {
      setPending(false);
    }
  };

  if (pendingVerification) {
    return (
      <ScreenWrapper contentContainerStyle={styles.contentContainerVerification}>
        <Heading text="Zweryfikuj adres e-mail" />
        <Text style={styles.verificationText}>
          Wprowadź kod potwierdzający, który został wysłany na podany adres e-mail.
        </Text>
        <TextInput
          value={code}
          placeholder="Wprowadź kod potwierdzający"
          onChangeText={(code) => setCode(code)}
          disabled={isPending}
        />
        <TouchableOpacityButton
          variant="primary"
          text="Zweryfikuj"
          onPress={onVerifyPress}
          disabled={isPending}
        />
        <View style={styles.securityNotice}>
          <Text>Bezpieczne logowanie i rejestracja z systemem Clerk.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper contentContainerStyle={styles.contentContainer}>
      <Heading text="Utwórz konto" />
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
        label="Adres e-mail"
        error={errors?.email_address}
        disabled={isPending}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        label="Hasło"
        error={errors?.password}
        disabled={isPending}
      />
      <BouncyCheckbox
        isChecked={legalAccepted}
        onPress={(checked) => setLegalAccepted(checked)}
        text="Akceptuję regulamin i politykę prywatności"
        fillColor={getColor('primary')}
        style={styles.checkboxContainer}
        textStyle={styles.checkboxText}
        disabled={isPending}
      />
      <TouchableOpacityButton
        variant="primary"
        onPress={onSignUpPress}
        text="Kontynuuj"
        disabled={isPending}
      />
      <View style={styles.loginPromptContainer}>
        <Text>Czy masz już konto?</Text>
        <Link href="/(tabs)/sign-in">
          <Text style={styles.link}>Zaloguj się</Text>
        </Link>
      </View>
      <View style={styles.privacyLink}>
        <Link href="/(tabs)/privacy-policy">
          <Text style={styles.link}>Polityka prywatności</Text>
        </Link>
      </View>
      <View style={styles.securityNotice}>
        <Text>Bezpieczne logowanie i rejestracja z systemem Clerk.</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
  },
  contentContainerVerification: {
    justifyContent: 'center',
  },
  verificationText: {
    marginBottom: 20,
  },
  securityNotice: {
    marginTop: 10,
  },
  checkboxContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 12,
    color: getColor('text'),
  },
  loginPromptContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    marginTop: 10,
  },
  privacyLink: {
    marginTop: 10,
  },
  link: {
    color: getColor('primary'),
    fontWeight: 600,
  },
});
