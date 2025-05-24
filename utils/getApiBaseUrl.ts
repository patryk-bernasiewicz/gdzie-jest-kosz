export function getApiBaseUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const prefix = process.env.EXPO_PUBLIC_BACKEND_API_PREFIX;

  if (!baseUrl) {
    throw new Error('Missing EXPO_PUBLIC_BACKEND_URL environment variable.');
  }
  if (!prefix) {
    throw new Error('Missing EXPO_PUBLIC_BACKEND_API_PREFIX environment variable.');
  }

  // Remove trailing slash from baseUrl and leading slash from prefix
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPrefix = prefix.replace(/^\/+/, '');

  return `${normalizedBase}/${normalizedPrefix}`;
} 