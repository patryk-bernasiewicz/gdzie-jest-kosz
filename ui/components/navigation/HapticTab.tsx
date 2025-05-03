import * as Haptics from 'expo-haptics';
import React from 'react';
import { GestureResponderEvent, Pressable, PressableProps } from 'react-native';

export default function HapticTab({
  onPress,
  children,
  accessibilityLabel,
  ...rest
}: PressableProps) {
  const handlePress = (event: GestureResponderEvent) => {
    Haptics.selectionAsync();
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
