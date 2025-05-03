import { type ComponentProps } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

import { getColor } from '@/lib/getColor';

const styles = StyleSheet.create({
  text: {
    color: getColor('text'),
    lineHeight: 18,
  },
});

type TextProps = ComponentProps<typeof RNText>;

export default function Text(props: TextProps) {
  return (
    <RNText
      {...props}
      style={[styles.text, ...(Array.isArray(props.style) ? props.style : [props.style])]}
    />
  );
}
