// src/stores/authStore.ts
import { create } from "zustand";
import { logger } from "./middleware/logger";
import AuthService from "@/service/AuthService";
import type { User } from "@/shared/types/userTYpes";
import { toast } from "sonner";
import i18n from "@/i18n";


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

// Helper para traducir errores
const translateError = (error: any): string => {
  const errorCode = error.response?.data?.errorCode;
  const parameters = error.response?.data?.parameters || {};

  if (errorCode) {
    return i18n.t(`errors.${errorCode}`, parameters) as string;
  }

  // Fallback a mensaje del servidor o mensaje genérico
  return error.response?.data?.message || i18n.t("errors.UNKNOWN_ERROR");
};

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
          toast.success(
            i18n.t("auth.loginSuccess") || "Sesión iniciada correctamente"
          );
        } catch (error: any) {
          const errorMessage = translateError(error);
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      register: async (data) => {
        set({ loading: true });
        try {
          await AuthService.register(data);
          toast.success(i18n.t("auth.registerSuccess") || "Registro exitoso");
        } catch (error: any) {
          const errorMessage = translateError(error);
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        AuthService.logout();
        set({ user: null });
        window.dispatchEvent(new CustomEvent("userLoggedOut"));
        toast.info(i18n.t("auth.logoutSuccess") || "Sesión cerrada");
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
