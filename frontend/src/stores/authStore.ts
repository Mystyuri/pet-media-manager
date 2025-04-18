import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apolloClient } from '@/lib/apollo';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      return {
        token: null,
        user: null,
        setAuth: (token, user) => set({ token, user }),
        logout: () => {
          void apolloClient.clearStore();
          set({ token: null, user: null });
        },
      };
    },
    {
      name: 'auth-storage',
    },
  ),
);
