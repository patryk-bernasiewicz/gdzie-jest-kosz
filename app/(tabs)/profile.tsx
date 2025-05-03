import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Href, Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import SignOutButton from '@/components/SignOutButton';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import useUserProfile from '@/feature/user/hooks/useUserProfile';
import { getColor } from '@/lib/getColor';

export default function ProfileScreen() {
  const userProfile = useUserProfile();

  return (
    <View style={styles.container}>
      <Heading text="Gdzie jest kosz" />
      <Link href="/(auth)/privacy-policy">
        <Text style={styles.link}>Polityka prywatności</Text>
      </Link>
      <SignedIn>
        {userProfile.data && (
          <>
            <Text style={styles.identifier}>
              Twój identyfikator Clerk:{'\n'}
              <View style={styles.code}>
                <Text>{userProfile.data.clerkId}</Text>
              </View>
            </Text>
            <Text style={styles.identifier}>
              Twój identyfikator w aplikacji Gdzie Jest Kosz:{'\n'}
              <View style={styles.code}>
                <Text>{userProfile.data.id}</Text>
              </View>
            </Text>
          </>
        )}
        <View style={styles.signOutWrapper}>
          <SignOutButton />
        </View>
      </SignedIn>
      <SignedOut>
        <View style={styles.signInWrapper}>
          <Link href={`/(auth)/sign-in` as Href}>
            <Text style={styles.link}>Zaloguj się</Text>
          </Link>
        </View>
        <View style={styles.signUpWrapper}>
          <Link href={`/(auth)/sign-up` as Href}>
            <Text style={styles.link}>Utwórz konto</Text>
          </Link>
        </View>
        <SignOutButton />
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: getColor('background'),
    position: 'relative',
    flex: 1,
    width: '100%',
    paddingTop: 80,
    paddingBottom: 110,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 0,
  },
  link: {
    fontSize: 20,
    fontWeight: 'bold',
    color: getColor('primary'),
    textDecorationLine: 'underline',
  },
  identifier: {
    fontSize: 12,
  },
  code: {
    backgroundColor: getColor('backgroundDim'),
    fontFamily: 'monospace',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 2,
  },
  signOutWrapper: {
    marginTop: 'auto',
  },
  signInWrapper: {
    marginTop: 12,
    marginBottom: 8,
  },
  signUpWrapper: {
    marginBottom: 8,
  },
});
