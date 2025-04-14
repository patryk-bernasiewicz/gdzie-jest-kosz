import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp, isClerkAPIResponseError } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import TextInput from "@/components/ui/input/TextInput";
import TouchableOpacityButton from "@/components/ui/TouchableOpacityButton";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import useUpsertUser from "@/hooks/useUpsertUser";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { getColor } from "@/lib/getColor";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: getColor("background"),
    flex: 1,
    padding: 20,
  },
  link: {
    color: getColor("primary"),
    fontWeight: 600,
  },
});

const errorTranslations: Record<string, string> = {
  form_param_nil: "Pole musi być wypełnione.",
  form_password_pwned:
    "Twoje hasło znajduje się na liście haseł, które wyciekły na innych stronach w Internecie. Proszę użyć innego hasła.",
  invalid_email_address: "Niepoprawny adres e-mail.",
  email_address_already_exists: "Ten adres e-mail już istnieje.",
  invalid_password: "Niepoprawne hasło.",
  password_too_short: "Hasło jest zbyt krótkie.",
  password_too_weak: "Hasło jest zbyt słabe.",
  missing_required_field: "Brak wymaganego pola.",
  invalid_verification_code: "Niepoprawny kod weryfikacyjny.",
};

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{
    email_address: string | null;
    password: string | null;
    consent_given: string | null;
  }>();
  const upsertUser = useUpsertUser();

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        legalAccepted,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        const emailError = err.errors.find(
          ({ meta }) => meta?.paramName === "email_address"
        );
        const emailErrorText =
          errorTranslations[emailError?.code || ""] ||
          emailError?.message ||
          null;
        const passwordError = err.errors.find(
          ({ meta }) => meta?.paramName === "password"
        );
        const passwordErrorText =
          errorTranslations[passwordError?.code || ""] ||
          passwordError?.message ||
          null;
        const legalError = err.errors.find(
          ({ meta }) => meta?.paramName === "legal_accepted"
        );
        const legalErrorText =
          errorTranslations[legalError?.code || ""] ||
          passwordError?.message ||
          null;

        setErrors({
          email_address: emailErrorText,
          password: passwordErrorText,
          consent_given: legalErrorText,
        });
      }
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        if (signUpAttempt.id) {
          await upsertUser.mutateAsync(signUpAttempt.id);
        }
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Heading text="Zweryfikuj adres e-mail" />
        <Text style={{ marginBottom: 10 }}>
          Wprowadź kod potwierdzający, który został wysłany na podany adres
          e-mail.
        </Text>
        <TextInput
          value={code}
          placeholder="Wprowadź kod potwierdzający"
          onChangeText={(code) => setCode(code)}
        />
        <Text>Akceptuję regulamin i politykę prywatności</Text>
        <TouchableOpacityButton
          variant="primary"
          text="Zweryfikuj"
          onPress={onVerifyPress}
        />
        <View style={{ marginTop: 10 }}>
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
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        label="Hasło"
        error={errors?.password}
      />
      <BouncyCheckbox
        isChecked={legalAccepted}
        onPress={(checked) => setLegalAccepted(checked)}
        text="Akceptuję regulamin i politykę prywatności"
        fillColor={getColor("primary")}
        style={{ marginTop: 10, marginBottom: 15 }}
        textStyle={{
          textDecorationLine: "none",
          fontSize: 12,
          color: getColor("text"),
        }}
      />

      <TouchableOpacityButton
        variant="primary"
        onPress={onSignUpPress}
        text="Kontynuuj"
      />
      <View
        style={{ display: "flex", flexDirection: "row", gap: 3, marginTop: 10 }}
      >
        <Text>Czy masz już konto?</Text>
        <Link href="/sign-in">
          <Text style={styles.link}>Zaloguj się</Text>
        </Link>
      </View>
      <View style={{ marginTop: 10 }}>
        <Link href="/privacy-policy">
          <Text style={styles.link}>Polityka prywatności</Text>
        </Link>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text>Bezpieczne logowanie i rejestracja z systemem Clerk.</Text>
      </View>
    </View>
  );
}
