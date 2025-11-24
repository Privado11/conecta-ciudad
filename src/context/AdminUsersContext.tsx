import AdminService from "@/service/AdminService";
import { ROLE_BADGE_CONFIG } from "@/shared/constants/user/userRoles";
import type { BulkUserImportResult } from "@/shared/interface/ImporAndExport";
import type {
  PagedResponse,
  Statistics,
} from "@/shared/interface/PaginatedResponse";
import type { LoadingUserState } from "@/shared/types/loadingTypes";
import type { CuratorDto, User, UserRole } from "@/shared/types/userTYpes";
import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type AdminUsersContextType = {
  userProfile: User | null;
  users: User[];
  currentCurator: CuratorDto | null;
  curatorsActive: CuratorDto[];
  selectedUser: User | null;
  loading: LoadingUserState;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  statistics: Statistics<User> | null;

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
  getCuratorsWithStats: (projectId: number) => Promise<void>;
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
  exportUsers: (filters?: {
    name?: string;
    role?: string;
    active?: boolean;
  }) => Promise<void>;
  exportAllUsers: () => Promise<void>;
  importUsers: (file: File) => Promise<BulkUserImportResult>;
  clearCurators: () => void;
};

export const AdminUsersContext = createContext<AdminUsersContextType | null>(null);

export const AdminUsersProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [curatorsActive, setCuratorsActive] = useState<CuratorDto[]>([]);
  const [currentCurator, setCurrentCurator] = useState<CuratorDto | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statistics, setStatistics] = useState<Statistics<User> | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });
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
      const data = await AdminService.getUsers(filters);

      if ("email" in data && "id" in data) {
        setUsers([data as User]);
        setPagination({
          currentPage: 0,
          totalPages: 1,
          totalElements: 1,
          pageSize: 1,
        });
      } else {
        const pagedData = data as PagedResponse<User>;
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
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Error al obtener usuarios";
      toast.error(errorMessage, {
        action: {
          label: "Reintentar",
          onClick: () => getUsers(filters),
        },
      });

      setUsers([]);
      setPagination({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
      });
      setStatistics(null);
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
      const newUser = await AdminService.createUser(data);
      setUsers((prev) => [...prev, newUser]);
      toast.success("El usuario " + newUser.name + " creado exitosamente");
    } catch (err: any) {
      const apiError =
        err.response?.data?.message || err.message || "Error al crear usuario";
      toast.error(apiError, {
        action: {
          label: "Reintentar",
          onClick: () => createUser(data),
        },
      });
      throw err;
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
      const updatedUser = await AdminService.updateUser(id, data);
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
      await AdminService.deleteUser(id);
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

  const addRole = async (id: number, role: UserRole) => {
    updateLoadingState("addingRole", true);
    try {
      const updatedUser = await AdminService.addRole(id, role);
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
      const updatedUser = await AdminService.removeRole(id, role);
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
      const toggledUser = await AdminService.toggleActive(id);
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


  const exportUsers = async (filters?: {
    name?: string;
    role?: string;
    active?: boolean;
  }) => {
    toast.promise(
      async () => {
        const blob = await AdminService.exportUsers({
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
        const blob = await AdminService.exportAllUsers();

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
      const result = await AdminService.importUsers(file);

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

  const getCuratorsWithStats = async (projectId: number) => {
    updateLoadingState("fetchingCurators", true);
    try {
      const data = await AdminService.getCuratorsWithStats(projectId);
      setCuratorsActive(data.activeCurators);
      setCurrentCurator(data.currentCurator);
    } catch (err: any) {
      toast.error(err.message || "Error al obtener curadores");
      setCuratorsActive([]);
      setCurrentCurator(null);
    } finally {
      updateLoadingState("fetchingCurators", false);
    }
  };

  const clearCurators = () => {
    setCuratorsActive([]);
    setCurrentCurator(null);
  };
  

  return (
    <AdminUsersContext.Provider
      value={{
        userProfile,
        users,
        curatorsActive,
        currentCurator,
        getCuratorsWithStats,

        selectedUser,
        loading,
        pagination,
        statistics,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
        addRole,
        removeRole,
        toggleActive,
        setSelectedUser,
        exportUsers,
        exportAllUsers,
        importUsers,
        clearCurators,
      }}
    >
      {children}
    </AdminUsersContext.Provider>
  );
};
