import { getDefaultStore } from "jotai";
import { authTokenAtom } from "./authToken.atom";
import { getClerkInstance } from "@clerk/clerk-expo";

export async function fetchAndSetClerkToken() {
  const clerkInstance = getClerkInstance();

  try {
    const token = await clerkInstance.session?.getToken();
    if (token) {
      getDefaultStore().set(authTokenAtom, token);
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
