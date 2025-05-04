import { getClerkInstance } from '@clerk/clerk-expo';

import { useAuthToken } from '../hooks/useAuthToken';

let cachedToken: string | null = null;
let cachedAt: number | null = null;
const TOKEN_CACHE_TTL = 30 * 1000;

async function getCachedClerkToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && cachedAt && now - cachedAt < TOKEN_CACHE_TTL) {
    return cachedToken;
  }
  return null;
}

export async function fetchAndSetClerkToken() {
  const clerkInstance = getClerkInstance();

  try {
    let token: string | null;
    token = await getCachedClerkToken();
    if (!token) {
      token =
        (await clerkInstance.session?.getToken({
          skipCache: true,
        })) || null;
      cachedToken = token;
      cachedAt = Date.now();
      useAuthToken.setState({ token });
    }

    if (token) {
      return token;
    } else {
      console.warn('[fetchAndSetClerkToken] Token fetch returned null.');
    }
  } catch (error) {
    console.error('[fetchAndSetClerkToken] Error fetching Clerk token:', error);
    return null;
  }
}
