import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import IconSymbol from '@/ui/components/IconSymbol';
import HapticTab from '@/ui/components/navigation/HapticTab';
import TabBarBackground from '@/ui/components/navigation/TabBarBackground';
import Colors from '@/ui/constants/Colors';
import useColorScheme from '@/ui/hooks/useColorScheme.web';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
