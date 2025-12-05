import { create } from "zustand";
import { logger } from "./middleware/logger";
import AuthService from "@/service/AuthService";
import type { User } from "@/shared/types/userTYpes";

interface AuthState {
  user: User | null;
  loading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    nationalId: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  refreshUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  logger(
    (set) => ({
      user: AuthService.getCurrentUser(),
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const loggedUser = await AuthService.login(email, password);
          set({ user: loggedUser });
          window.dispatchEvent(new CustomEvent("userLoggedIn"));
        } finally {
          set({ loading: false });
        }
      },

      register: async (data) => {
        set({ loading: true });
        try {
          await AuthService.register(data);
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        AuthService.logout();
        set({ user: null });
        window.dispatchEvent(new CustomEvent("userLoggedOut"));
      },

      isAuthenticated: (): boolean => {
        return AuthService.isAuthenticated();
      },

      refreshUser: () => {
        const storedUser = AuthService.getCurrentUser();
        set({ user: storedUser });
      },
    }),
    "AuthStore"
  )
);
