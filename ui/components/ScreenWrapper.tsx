import { ScrollView, ScrollViewProps, StyleSheet, ViewStyle } from 'react-native';

import getColor from '@/ui/utils/getColor';

interface ScreenWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: ViewStyle; // Allow additional styles to be passed
}

export default function ScreenWrapper({ children, style, ...props }: ScreenWrapperProps) {
  return (
    <ScrollView
      style={[styles.wrapper, style]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: getColor('background'),
    paddingTop: 60, // Standard top padding
    paddingHorizontal: 20, // Standard horizontal padding
  },
  contentContainer: {
    flexGrow: 1, // Ensures content can grow to fill ScrollView
  },
});
