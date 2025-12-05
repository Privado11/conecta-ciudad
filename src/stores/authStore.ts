// src/stores/authStore.ts
import { create } from "zustand";
import { logger } from "./middleware/logger";
import AuthService from "@/service/AuthService";
import type { User } from "@/shared/types/userTYpes";
import { toast } from "sonner";
import i18n from "@/i18n";
import {
  translateError,
  isValidationError,
  getValidationErrorsList,
} from "@/utils/errorUtils";

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
          toast.success(
            (i18n.t("auth.loginSuccess") as string) ||
              "Sesión iniciada correctamente"
          );
        } catch (error: any) {
          console.group("🔴 Login Error");
          console.log("Error completo:", error);
          console.log("Error.response:", error.response);
          console.log("Error.response.data:", error.response?.data);
          console.groupEnd();

          // Verificar si es error de validación
          if (isValidationError(error)) {
            const validationErrors = getValidationErrorsList(error);

            // Mostrar cada error de validación
            validationErrors.forEach((err) => {
              toast.error(`${err.field}: ${err.message}`);
            });
          } else {
            // Error simple
            const errorMessage = translateError(error);
            toast.error(errorMessage);
          }
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      register: async (data) => {
        set({ loading: true });
        try {
          await AuthService.register(data);
          toast.success(
            (i18n.t("auth.registerSuccess") as string) || "Registro exitoso"
          );
        } catch (error: any) {
          console.group("🔴 Register Error - DEBUGGING");
          console.log("1. Error completo:", error);
          console.log("2. Error.response:", error.response);
          console.log("3. Error.response?.data:", error.response?.data);
          console.log(
            "4. Error.response?.data?.errorCode:",
            error.response?.data?.errorCode
          );
          console.log(
            "5. Error.response?.data?.validationErrors:",
            error.response?.data?.validationErrors
          );
          console.log("6. Error.message:", error.message);
          console.groupEnd();

          // Verificar si es error de validación
          if (isValidationError(error)) {
            const validationErrors = getValidationErrorsList(error);

            console.log(
              "✅ Es error de validación, errores:",
              validationErrors
            );
            console.log("Total de errores:", validationErrors.length);

            if (validationErrors.length === 0) {
              // Fallback si no hay errores en la lista
              toast.error("Error de validación en los datos enviados");
            } else if (validationErrors.length === 1) {
              // Un solo error - mostrar limpio
              const err = validationErrors[0];
              console.log("Mostrando error único:", err);
              toast.error(err.message, {
                description: `Campo: ${err.field}`,
                duration: 5000,
              });
            } else {
              // Múltiples errores
              console.log("Mostrando múltiples errores");
              const errorList = validationErrors
                .map((err) => `${err.field}: ${err.message}`)
                .join("\n");

              toast.error("Errores de validación encontrados:", {
                description: errorList,
                duration: 6000,
              });
            }
          } else {
            // Error simple (no validación)
            console.log("⚠️ No es error de validación, traduciendo...");
            const errorMessage = translateError(error);
            console.log("Mensaje traducido:", errorMessage);
            toast.error(errorMessage);
          }
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        AuthService.logout();
        set({ user: null });
        window.dispatchEvent(new CustomEvent("userLoggedOut"));
        toast.info(
          (i18n.t("auth.logoutSuccess") as string) || "Sesión cerrada"
        );
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
