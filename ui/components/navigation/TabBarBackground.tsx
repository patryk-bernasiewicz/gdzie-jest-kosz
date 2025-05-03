import { BlurView } from 'expo-blur';
import React from 'react';
import { Appearance, Platform, StyleSheet, View } from 'react-native';

import getColor from '@/ui/utils/getColor';

const colorScheme = Appearance.getColorScheme();

export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={50}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.blur}
      />
    );
  }

  return <View style={styles.wrapper} />;
}

const styles = StyleSheet.create({
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    backgroundColor: getColor('background'),
    opacity: 0.95,
  },
});
