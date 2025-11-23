import UserService from "@/service/UserService";
import type { LoadingUserState } from "@/shared/types/loadingTypes";
import type { User } from "@/shared/types/userTYpes";
import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type UserContextType = {
  userProfile: User | null;
  selectedUser: User | null;
  loading: LoadingUserState;

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
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<LoadingUserState>({
    fetching: false,
    creating: false,
    updating: false,
    deleting: false,
    togglingActive: false,
    addingRole: false,
    removingRole: false,
    fetchingCurators: false,
    assigningCurator: false,
  });

  const updateLoadingState = (key: keyof LoadingUserState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const getUserById = async (id: number) => {
    updateLoadingState("fetching", true);
    try {
      const user = await UserService.getUserById(id);
      setSelectedUser(user);
      return user;
    } catch (err: any) {
      toast.error(err.message || "Error al obtener usuario", {
        action: {
          label: "Reintentar",
          onClick: () => getUserById(id),
        },
      });
      return null;
    } finally {
      updateLoadingState("fetching", false);
    }
  };

  const updateUser = async (
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ) => {
    updateLoadingState("updating", true);
    try {
      const updatedUser = await UserService.updateUser(id, data);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );
      if (selectedUser?.id === id) {
        setSelectedUser(updatedUser);
      }

      if (userProfile?.id === id) {
        setUserProfile(updatedUser);
      }

      toast.success(
        "El usuario " + updatedUser.name + " actualizado exitosamente"
      );
    } catch (err: any) {
      const apiError =
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar usuario";
      toast.error(apiError, {
        action: {
          label: "Reintentar",
          onClick: () => updateUser(id, data),
        },
      });
      throw err;
    } finally {
      updateLoadingState("updating", false);
    }
  };

  const deleteUser = async (id: number) => {
    updateLoadingState("deleting", true);
    try {
      const isOwnAccount = userProfile?.id === id;
      await UserService.deleteUser(id);
      const user = users.find((user) => user.id === id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      if (isOwnAccount) {
        setUserProfile(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        toast.success("Tu cuenta ha sido eliminada exitosamente");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);

        return;
      }
      toast.success("El usuario " + user?.name + " eliminado exitosamente");
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar usuario", {
        action: {
          label: "Reintentar",
          onClick: () => deleteUser(id),
        },
      });
    } finally {
      updateLoadingState("deleting", false);
    }
  };

  const validateUniqueFields = async (params: {
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
  };

  const changePassword = async (
    id: number,
    data: { oldPassword: string; newPassword: string }
  ): Promise<string> => {
    updateLoadingState("updating", true);
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
          onClick: () => changePassword(id, data),
        },
      });

      throw err;
    } finally {
      updateLoadingState("updating", false);
    }
  };

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    updateLoadingState("fetching", true);
    try {
      const user = await UserService.getCurrentUser();
      setUserProfile(user);
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
      updateLoadingState("fetching", false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();

    const handleUserLoggedIn = () => {
      getCurrentUser();
    };

    const handleUserLoggedOut = () => {
      setUserProfile(null);
    };

    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    window.addEventListener("userLoggedOut", handleUserLoggedOut);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("userLoggedOut", handleUserLoggedOut);
    };
  }, [getCurrentUser]);

  return (
    <UserContext.Provider
      value={{
        userProfile,

        getCurrentUser,
        selectedUser,
        loading,

        getUserById,

        updateUser,
        deleteUser,

        setSelectedUser,
        validateUniqueFields,

        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
