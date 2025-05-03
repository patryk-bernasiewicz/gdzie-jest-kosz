export default function getDevMode(): boolean {
  return process.env.EXPO_PUBLIC_DEV_MODE === 'true';
}
