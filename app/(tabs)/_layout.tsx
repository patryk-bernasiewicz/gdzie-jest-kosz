import { Tabs } from 'expo-router';
import React from 'react';

import IconSymbol from '@/ui/components/IconSymbol';
import getColor from '@/ui/utils/getColor';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: getColor('primary'),
        tabBarInactiveTintColor: getColor('textDim'),
        tabBarStyle: {
          backgroundColor: getColor('background'),
          borderTopColor: getColor('border'),
          paddingBottom: 1,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <IconSymbol name="map" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <IconSymbol name="person" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sign-in"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="sign-up"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="privacy-policy"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
