import { getDefaultStore } from "jotai";
import { authTokenAtom } from "./authToken.atom";
import { getClerkInstance } from "@clerk/clerk-expo";

let cachedToken: string | null = null;
let cachedAt: number | null = null;
const TOKEN_CACHE_TTL = 60 * 1000;

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
    const token =
      (await getCachedClerkToken()) ||
      (await clerkInstance.session?.getToken());
    if (token) {
      getDefaultStore().set(authTokenAtom, token);
      cachedToken = token;
      cachedAt = Date.now();

      return token;
    } else {
      console.warn("[fetchAndSetClerkToken 1] Token fetch returned null.");
    }
  } catch (error) {
    console.error(
      "[fetchAndSetClerkToken 2] Error fetching Clerk token:",
      error
    );
    return null;
  }
}
