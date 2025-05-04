import { create } from 'zustand';

type AuthTokenStore = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useAuthToken = create<AuthTokenStore>((set) => ({
  token: null,
  setToken: (token: string | null) => set({ token }),
}));
