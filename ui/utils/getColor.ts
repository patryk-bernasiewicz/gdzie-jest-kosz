import { Appearance } from 'react-native';

const colorScheme = Appearance.getColorScheme();

const lightPalette = {
  text: '#0f0f0f',
  textDim: '#666666',
  textInvert: '#000000',
  heading: '#000000',
  border: '#cccccc',
  background: '#ffffff',
  backgroundDim: '#f0f0f0',
  error: '#f57251',
  primary: '#0274bd',
  mapBackground: '#add8e6',
} as const;

const darkPalette = {
  text: '#f0f0f0',
  textDim: '#999999',
  textInvert: '#ffffff',
  heading: '#f0f0f0',
  border: '#333333',
  background: '#0f0f0f',
  backgroundDim: '#1f1f1f',
  error: '#f57251',
  primary: '#0274bd',
  mapBackground: '#add8e6',
} as const;

export type PaletteKey = keyof typeof lightPalette;

export default function getColor(key: PaletteKey): string {
  if (colorScheme === 'dark') {
    return darkPalette[key];
  } else {
    return lightPalette[key];
  }
}
