import { atom, useAtom } from "jotai";

const baseAuthTokenAtom = atom<string | null>(null);

export const authTokenAtom = atom(
  (get) => get(baseAuthTokenAtom),
  (_get, set, newToken: string | null) => {
    set(baseAuthTokenAtom, newToken);
  }
);

export const useAuthToken = () => {
  return useAtom(authTokenAtom);
};
