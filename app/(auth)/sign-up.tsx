import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { useSession } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import TouchableOpacityButton from '@/components/ui/TouchableOpacityButton';
import TextInput from '@/components/ui/input/TextInput';
import { useAuthToken } from '@/feature/auth/store/authToken.atom';
import { getColor } from '@/lib/getColor';

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
  verificationText: {
    marginBottom: 10,
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
});

const errorTranslations: Record<string, string> = {
  form_param_nil: 'Pole musi być wypełnione.',
  form_password_pwned:
    'Twoje hasło znajduje się na liście haseł, które wyciekły na innych stronach w Internecie. Proszę użyć innego hasła.',
  invalid_email_address: 'Niepoprawny adres e-mail.',
  email_address_already_exists: 'Ten adres e-mail już istnieje.',
  invalid_password: 'Niepoprawne hasło.',
  password_too_short: 'Hasło jest zbyt krótkie.',
  password_too_weak: 'Hasło jest zbyt słabe.',
  missing_required_field: 'Brak wymaganego pola.',
  invalid_verification_code: 'Niepoprawny kod weryfikacyjny.',
};

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { session } = useSession();
  const [, setAuthToken] = useAuthToken();
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
      if (token) {
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }

      router.replace('/profile');
    })();
  }, [isLoaded, session, setAuthToken, router]);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setPending(true);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        legalAccepted,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        const emailError = err.errors.find(({ meta }) => meta?.paramName === 'email_address');
        const emailErrorText =
          errorTranslations[emailError?.code || ''] || emailError?.message || null;
        const passwordError = err.errors.find(({ meta }) => meta?.paramName === 'password');
        const passwordErrorText =
          errorTranslations[passwordError?.code || ''] || passwordError?.message || null;
        const legalError = err.errors.find(({ meta }) => meta?.paramName === 'legal_accepted');
        const legalErrorText =
          errorTranslations[legalError?.code || ''] || legalError?.message || null;

        setErrors({
          email_address: emailErrorText,
          password: passwordErrorText,
          consent_given: legalErrorText,
        });
      }
    } finally {
      setPending(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setPending(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setPending(false);
    }
  };
  if (pendingVerification) {
    return (
      <>
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
        <Text>Akceptuję regulamin i politykę prywatności</Text>
        <TouchableOpacityButton
          variant="primary"
          text="Zweryfikuj"
          onPress={onVerifyPress}
          disabled={isPending}
        />
        <View style={styles.securityNotice}>
          <Text>Bezpieczne logowanie i rejestracja z systemem Clerk.</Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.wrapper}>
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
      />{' '}
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
      />{' '}
      <View style={styles.loginPromptContainer}>
        <Text>Czy masz już konto?</Text>
        <Link href="/sign-in">
          <Text style={styles.link}>Zaloguj się</Text>
        </Link>
      </View>
      <View style={styles.privacyLink}>
        <Link href="/privacy-policy">
          <Text style={styles.link}>Polityka prywatności</Text>
        </Link>
      </View>
      <View style={styles.securityNotice}>
        <Text>Bezpieczne logowanie i rejestracja z systemem Clerk.</Text>
      </View>
    </View>
  );
}
