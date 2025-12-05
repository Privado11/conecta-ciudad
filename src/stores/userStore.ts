import { create } from "zustand";
import { logger } from "./middleware/logger";
import UserService from "@/service/UserService";
import type { User } from "@/shared/types/userTYpes";
import type { LoadingUserState } from "@/shared/types/loadingTypes";
import { toast } from "sonner";

interface UserState {
  userProfile: User | null;
  selectedUser: User | null;
  loading: LoadingUserState;

  // Actions
  getUserById: (id: number) => Promise<User | null>;
  updateUser: (
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  validateUniqueFields: (params: {
    email?: string;
    nationalId?: string;
  }) => Promise<{ available: boolean; message: string }>;
  getCurrentUser: () => Promise<User | null>;
  changePassword: (
    id: number,
    data: { oldPassword: string; newPassword: string }
  ) => Promise<string>;
}

const initialLoadingState: LoadingUserState = {
  fetching: false,
  creating: false,
  updating: false,
  deleting: false,
  togglingActive: false,
  addingRole: false,
  removingRole: false,
  fetchingCurators: false,
  assigningCurator: false,
};

export const useUserStore = create<UserState>()(
  logger(
    (set, get) => ({
      userProfile: null,
      selectedUser: null,
      loading: initialLoadingState,

      getUserById: async (id: number) => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const user = await UserService.getUserById(id);
          set({ selectedUser: user });
          return user;
        } catch (err: any) {
          toast.error(err.message || "Error al obtener usuario", {
            action: {
              label: "Reintentar",
              onClick: () => get().getUserById(id),
            },
          });
          return null;
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      updateUser: async (
        id: number,
        data: Partial<Omit<User, "id" | "roles">>
      ) => {
        set((state) => ({ loading: { ...state.loading, updating: true } }));
        try {
          const updatedUser = await UserService.updateUser(id, data);

          const { selectedUser, userProfile } = get();

          if (selectedUser?.id === id) {
            set({ selectedUser: updatedUser });
          }

          if (userProfile?.id === id) {
            set({ userProfile: updatedUser });
          }

          toast.success(
            `El usuario ${updatedUser.name} actualizado exitosamente`
          );
        } catch (err: any) {
          const apiError =
            err.response?.data?.message ||
            err.message ||
            "Error al actualizar usuario";
          toast.error(apiError, {
            action: {
              label: "Reintentar",
              onClick: () => get().updateUser(id, data),
            },
          });
          throw err;
        } finally {
          set((state) => ({ loading: { ...state.loading, updating: false } }));
        }
      },

      deleteUser: async (id: number) => {
        set((state) => ({ loading: { ...state.loading, deleting: true } }));
        try {
          const isOwnAccount = get().userProfile?.id === id;
          await UserService.deleteUser(id);

          if (isOwnAccount) {
            set({ userProfile: null });
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            toast.success("Tu cuenta ha sido eliminada exitosamente");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
            return;
          }

          toast.success("Usuario eliminado exitosamente");
        } catch (err: any) {
          toast.error(err.message || "Error al eliminar usuario", {
            action: {
              label: "Reintentar",
              onClick: () => get().deleteUser(id),
            },
          });
        } finally {
          set((state) => ({ loading: { ...state.loading, deleting: false } }));
        }
      },

      setSelectedUser: (user: User | null) => {
        set({ selectedUser: user });
      },

      validateUniqueFields: async (params: {
        email?: string;
        nationalId?: string;
      }) => {
        try {
          const response = await UserService.validateUniqueFields(params);
          return response;
        } catch (err: any) {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Error al validar datos únicos";
          toast.error(message);
          return { available: false, message };
        }
      },

      getCurrentUser: async (): Promise<User | null> => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const user = await UserService.getCurrentUser();
          set({ userProfile: user });
          return user;
        } catch (err: any) {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Error al obtener usuario actual";

          if (!err?.message?.includes("No user found")) {
            toast.error(errorMessage);
          }
          return null;
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      changePassword: async (
        id: number,
        data: { oldPassword: string; newPassword: string }
      ): Promise<string> => {
        set((state) => ({ loading: { ...state.loading, updating: true } }));
        try {
          const response = await UserService.changePassword(id, data);
          toast.success("Contraseña actualizada exitosamente");
          return response;
        } catch (err: any) {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Error al cambiar contraseña";

          toast.error(message, {
            action: {
              label: "Reintentar",
              onClick: () => get().changePassword(id, data),
            },
          });

          throw err;
        } finally {
          set((state) => ({ loading: { ...state.loading, updating: false } }));
        }
      },
    }),
    "UserStore"
  )
);

// Setup event listeners
if (typeof window !== "undefined") {
  const handleUserLoggedIn = () => {
    useUserStore.getState().getCurrentUser();
  };

  const handleUserLoggedOut = () => {
    useUserStore.setState({ userProfile: null });
  };

  window.addEventListener("userLoggedIn", handleUserLoggedIn);
  window.addEventListener("userLoggedOut", handleUserLoggedOut);

  // Initial load
  useUserStore.getState().getCurrentUser();
}
