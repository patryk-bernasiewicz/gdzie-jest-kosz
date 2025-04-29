import { getDefaultStore } from "jotai";
import { authTokenAtom } from "./authToken.atom";
import { getClerkInstance } from "@clerk/clerk-expo";

let cachedToken: string | null = null;
let cachedAt: number | null = null;
const TOKEN_CACHE_TTL = 30 * 1000;

async function getCachedClerkToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && cachedAt && now - cachedAt < TOKEN_CACHE_TTL) {
    console.log("GOT CACHED TOKEN", {
      now,
      cachedAt,
      "now - cachedAt": now - cachedAt,
      cachedToken,
    });
    return cachedToken;
  }
  return null;
}

export async function fetchAndSetClerkToken() {
  const clerkInstance = getClerkInstance();

  try {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);

    let token: string | null;
    token = await getCachedClerkToken();
    if (!token) {
      token =
        (await clerkInstance.session?.getToken({
          skipCache: true,
        })) || null;
      cachedToken = token;
      cachedAt = Date.now();
      getDefaultStore().set(authTokenAtom, token);
    }

    if (token) {
      return token;
    } else {
      console.warn("[fetchAndSetClerkToken] Token fetch returned null.");
    }
  } catch (error) {
    console.error("[fetchAndSetClerkToken] Error fetching Clerk token:", error);
    return null;
  }
}
