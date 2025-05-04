/* eslint-disable no-undef */
import { ClerkProvider } from '@clerk/clerk-expo';
import { resourceCache } from '@clerk/clerk-expo/resource-cache';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { plPL } from '@clerk/localizations/pl-PL';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MapScreen from './feature/map/screens/MapScreen';
import ProfileScreen from './feature/user/screens/ProfileScreen';
import IconSymbol from './ui/components/IconSymbol';
import getColor from './ui/utils/getColor';

// Clerk workaround for muting network requests in non-browser environments.
// TODO: Verify if this is still relevant and necessary.
// @ts-ignore
window.navigator.onLine = true;

const queryClient = new QueryClient();

const Tab = createBottomTabNavigator();

const tabCommonOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: getColor('primary'),
  tabBarInactiveTintColor: getColor('textDim'),
  tabBarActiveBackgroundColor: getColor('backgroundDim'),
  tabBarInactiveBackgroundColor: getColor('background'),
  tabBarStyle: {
    backgroundColor: getColor('background'),
    borderTopColor: getColor('border'),
    paddingBottom: 1,
  },
};

export default function App() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      experimental={{
        rethrowOfflineNetworkErrors: true,
      }}
      __experimental_resourceCache={resourceCache}
      localization={plPL}
    >
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Map">
            <Tab.Screen
              name="Map"
              component={MapScreen}
              options={{
                tabBarLabel: 'Mapa',
                tabBarIcon: ({ size }) => (
                  <IconSymbol size={size} name="map" color={getColor('text')} />
                ),
                ...tabCommonOptions,
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarLabel: 'Profil',
                tabBarIcon: ({ size }) => (
                  <IconSymbol size={size} name="person" color={getColor('text')} />
                ),
                ...tabCommonOptions,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
