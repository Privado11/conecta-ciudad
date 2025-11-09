import UserService from "@/service/UserService";
import { ROLE_BADGE_CONFIG } from "@/shared/constants/userRoles";
import type { BulkUserImportResult } from "@/shared/interface/ImporAndExport";
import type {
  PagedUserResponse,
  UserStatistics,
} from "@/shared/interface/PaginatedResponse";
import type { LoadingState } from "@/shared/types/loadingTypes";
import type { User, UserRole } from "@/shared/types/userTYpes";
import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type UserContextType = {
  users: User[];
  selectedUser: User | null;
  loading: LoadingState;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  statistics: UserStatistics | null;

  getUsers: (filters?: {
    name?: string;
    email?: string;
    nationalId?: string;
    role?: string;
    active?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }) => Promise<void>;
  getUserById: (id: number) => Promise<User | null>;
  createUser: (data: {
    name: string;
    email: string;
    password: string;
    nationalId: string;
    phone: string;
    roles: string[];
  }) => Promise<void>;
  updateUser: (
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  addRole: (id: number, role: UserRole) => Promise<void>;
  removeRole: (id: number, role: UserRole) => Promise<void>;
  toggleActive: (id: number) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  validateUniqueFields: (params: {
    email?: string;
    nationalId?: string;
  }) => Promise<{ available: boolean; message: string }>;
  exportUsers: (filters?: {
    name?: string;
    role?: string;
    active?: boolean;
  }) => Promise<void>;
  exportAllUsers: () => Promise<void>;
  importUsers: (file: File) => Promise<BulkUserImportResult>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState<LoadingState>({
    fetching: false,
    creating: false,
    updating: false,
    deleting: false,
    togglingActive: false,
    addingRole: false,
    removingRole: false,
  });

  const updateLoadingState = (key: keyof LoadingState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const getUsers = async (filters?: {
    name?: string;
    email?: string;
    nationalId?: string;
    role?: string;
    active?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }) => {
    updateLoadingState("fetching", true);
    try {
      const data = await UserService.getUsers(filters);

      if ("email" in data && "id" in data) {
        setUsers([data as User]);
        setPagination({
          currentPage: 0,
          totalPages: 1,
          totalElements: 1,
          pageSize: 1,
        });
      } else {
        const pagedData = data as PagedUserResponse;
        setUsers(pagedData.page.content);
        setPagination({
          currentPage: pagedData.page.number,
          totalPages: pagedData.page.totalPages,
          totalElements: pagedData.page.totalElements,
          pageSize: pagedData.page.size,
        });
        setStatistics(pagedData.statistics); 
      }
    } catch (err: any) {
      toast.error(err.message || "Error al obtener usuarios", {
        action: {
          label: "Reintentar",
          onClick: () => getUsers(filters),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
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

  const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    nationalId: string;
    phone?: string;
    roles: string[];
  }) => {
    updateLoadingState("creating", true);
    try {
      const newUser = await UserService.createUser(data);
      setUsers((prev) => [...prev, newUser]);
      toast.success("El usuario " + newUser.name + " creado exitosamente");
    } catch (err: any) {
      toast.error(err.message || "Error al crear usuario", {
        action: {
          label: "Reintentar",
          onClick: () => createUser(data),
        },
      });
    } finally {
      updateLoadingState("creating", false);
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
      toast.success(
        "El usuario " + updatedUser.name + " actualizado exitosamente"
      );
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar usuario", {
        action: {
          label: "Reintentar",
          onClick: () => updateUser(id, data),
        },
      });
    } finally {
      updateLoadingState("updating", false);
    }
  };

  const deleteUser = async (id: number) => {
    updateLoadingState("deleting", true);
    try {
      await UserService.deleteUser(id);
      const user = users.find((user) => user.id === id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
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

  const addRole = async (id: number, role: UserRole) => {
    updateLoadingState("addingRole", true);
    try {
      const updatedUser = await UserService.addRole(id, role);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, roles: [...(user.roles || []), role] }
            : user
        )
      );

      const roleLabel = ROLE_BADGE_CONFIG[role]?.label || role;
      
      toast.success(
        "Se ha asignado correctamente el rol " +
          roleLabel +
          " al usuario " +
          updatedUser.name
      );
    } catch (err: any) {
      toast.error(err.message || "Error al asignar rol", {
        action: {
          label: "Reintentar",
          onClick: () => addRole(id, role),
        },
      });
    } finally {
      updateLoadingState("addingRole", false);
    }
  };

  const removeRole = async (id: number, role: UserRole) => {
    updateLoadingState("removingRole", true);
    try {
      const updatedUser = await UserService.removeRole(id, role);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, roles: (user.roles || []).filter((r) => r !== role) }
            : user
        )
      );
      toast.success(
        "Se ha removido correctamente el rol" +
          role +
          " al usuario " +
          updatedUser.name
      );
    } catch (err: any) {
      toast.error(err.message || "Error al remover rol", {
        action: {
          label: "Reintentar",
          onClick: () => removeRole(id, role),
        },
      });
    } finally {
      updateLoadingState("removingRole", false);
    }
  };

  const toggleActive = async (id: number) => {
    updateLoadingState("togglingActive", true);
    try {
      const toggledUser = await UserService.toggleActive(id);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, active: toggledUser.active } : user
        )
      );
      toast.success(
        "El usuario " +
          toggledUser.name +
          " ha sido" +
          (toggledUser.active ? " activado" : " desactivado") +
          " exitosamente"
      );
    } catch (err: any) {
      toast.error(err.message || "Error al cambiar estado de usuario", {
        action: {
          label: "Reintentar",
          onClick: () => toggleActive(id),
        },
      });
    } finally {
      updateLoadingState("togglingActive", false);
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

  const exportUsers = async (filters?: {
    name?: string;
    role?: string;
    active?: boolean;
  }) => {
    toast.promise(
      async () => {
        const blob = await UserService.exportUsers({
          ...filters,
          page: 0,
          size: 1000,
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const timestamp = new Date().toISOString().split("T")[0];
        const filterInfo =
          filters?.role || filters?.active !== undefined ? "_filtrado" : "";
        const filename = `usuarios${filterInfo}_${timestamp}.csv`;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { filename, count: 0 };
      },
      {
        loading: "Exportando usuarios...",
        success: (data) => `Archivo ${data.filename} descargado exitosamente`,
        error: (err) => err.message || "Error al exportar usuarios",
      }
    );
  };

  const exportAllUsers = async () => {
    toast.promise(
      async () => {
        const blob = await UserService.exportAllUsers();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `usuarios_completo_${timestamp}.csv`;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { filename };
      },
      {
        loading: "Exportando todos los usuarios...",
        success: (data) => `${data.filename} descargado exitosamente`,
        error: (err) => err.message || "Error al exportar usuarios",
      }
    );
  };

  const importUsers = async (file: File): Promise<BulkUserImportResult> => {
    try {
      const result = await UserService.importUsers(file);

      if (result.failedImports === 0) {
        toast.success(
          `${result.successfulImports} usuario(s) importado(s) exitosamente`
        );
      } else {
        toast.warning(
          `Importación parcial: ${result.successfulImports} exitosos, ${result.failedImports} fallidos`,
          {
            description: "Revisa los errores en el detalle",
          }
        );
      }

      await getUsers();

      return result;
    } catch (err: any) {
      toast.error(err.message || "Error al importar usuarios");
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        selectedUser,
        loading,
        pagination,
        statistics,
        getUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        addRole,
        removeRole,
        toggleActive,
        setSelectedUser,
        validateUniqueFields,
        exportUsers,
        exportAllUsers,
        importUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
