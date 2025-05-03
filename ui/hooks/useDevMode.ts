const isDevMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

export default function useDevMode() {
  return isDevMode;
}
