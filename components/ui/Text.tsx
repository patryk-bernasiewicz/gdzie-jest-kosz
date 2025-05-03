import { getColor } from '@/lib/getColor';
import { type ComponentProps } from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

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
