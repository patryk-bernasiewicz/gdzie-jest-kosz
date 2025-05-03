/* the variants here are used in a dynamic way, but eslint doesn't know that */
/* eslint-disable react-native/no-color-literals, react-native/no-unused-styles */
import { getColor } from '@/lib/getColor';
import { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: getColor('border'),
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
  secondary: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
  tertiary: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
});

const variantTextStyles = StyleSheet.create({
  primary: {
    color: '#fff',
  },
  secondary: {
    color: '#fff',
  },
  tertiary: {
    color: '#000',
  },
});

type TouchableOpacityButtonProps = ComponentProps<typeof TouchableOpacity> & {
  text: string;
  variant?: keyof typeof variantStyles;
};

export default function TouchableOpacityButton({
  variant,
  text,
  ...touchableOpacityProps
}: TouchableOpacityButtonProps) {
  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      style={{ ...styles.button, ...(variant ? variantStyles[variant] : {}) }}
    >
      {text && (
        <Text
          style={{
            ...styles.text,
            ...(variant ? variantTextStyles[variant] : {}),
          }}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
