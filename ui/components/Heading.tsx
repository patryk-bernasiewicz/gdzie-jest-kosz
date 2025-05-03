import { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

import getColor from '@/ui/utils/getColor';

type HeadingProps = ComponentProps<typeof Text> & {
  text: string;
};

export default function Heading({ text, ...textProps }: HeadingProps) {
  return (
    <Text {...textProps} style={styles.heading}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: getColor('heading'),
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 20,
  },
});
