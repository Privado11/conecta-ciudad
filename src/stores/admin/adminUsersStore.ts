import { create } from "zustand";
import { logger } from "../middleware/logger";
import AdminUserService from "@/service/admin/AdminUserService";
import type { User, UserRole, CuratorInfoDto } from "@/shared/types/userTYpes";
import type { PagedResponse } from "@/shared/interface/PaginatedResponse";
import type { BulkUserImportResult } from "@/shared/interface/ImporAndExport";
import { toast } from "sonner";

interface LoadingState {
  fetching: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  togglingActive: boolean;
  addingRole: boolean;
  removingRole: boolean;
  exporting: boolean;
  importing: boolean;
}

interface AdminUsersState {
  users: User[];
  pagedUsers: PagedResponse<User> | null;
  selectedUser: User | null;
  curators: CuratorInfoDto | null;
  loading: LoadingState;

  fetchUsers: (filters?: any) => Promise<void>;
  createUser: (data: any) => Promise<User | null>;
  updateUser: (
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleUserActive: (id: number) => Promise<void>;
  addRole: (id: number, role: UserRole) => Promise<void>;
  removeRole: (id: number, role: UserRole) => Promise<void>;
  fetchCurators: (projectId: number) => Promise<void>;
  exportUsers: (filters?: any) => Promise<Blob>;
  exportAllUsers: () => Promise<Blob>;
  importUsers: (file: File) => Promise<BulkUserImportResult>;
  setSelectedUser: (user: User | null) => void;
}

const initialLoadingState: LoadingState = {
  fetching: false,
  creating: false,
  updating: false,
  deleting: false,
  togglingActive: false,
  addingRole: false,
  removingRole: false,
  exporting: false,
  importing: false,
};

export const useAdminUsersStore = create<AdminUsersState>()(
  logger(
    (set, get) => ({
      users: [],
      pagedUsers: null,
      selectedUser: null,
      curators: null,
      loading: initialLoadingState,

      fetchUsers: async (filters?: any) => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const result = await AdminUserService.getUsers(filters);

          if ("content" in result) {
            set({ pagedUsers: result as PagedResponse<User> });
          } else {
            set({ selectedUser: result as User });
          }
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      createUser: async (data: any) => {
        set((state) => ({ loading: { ...state.loading, creating: true } }));
        try {
          const newUser = await AdminUserService.createUser(data);

          toast.success(`Usuario ${newUser.name} creado exitosamente`);

          return newUser;
        } catch (error: any) {
          return null;
        } finally {
          set((state) => ({ loading: { ...state.loading, creating: false } }));
        }
      },

      updateUser: async (
        id: number,
        data: Partial<Omit<User, "id" | "roles">>
      ) => {
        set((state) => ({ loading: { ...state.loading, updating: true } }));
        try {
          const updatedUser = await AdminUserService.updateUser(id, data);

          if (get().selectedUser?.id === id) {
            set({ selectedUser: updatedUser });
          }

          toast.success(`Usuario ${updatedUser.name} actualizado exitosamente`);
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, updating: false } }));
        }
      },

      deleteUser: async (id: number) => {
        set((state) => ({ loading: { ...state.loading, deleting: true } }));
        try {
          await AdminUserService.deleteUser(id);

          toast.success("Usuario eliminado exitosamente");
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, deleting: false } }));
        }
      },

      toggleUserActive: async (id: number) => {
        set((state) => ({
          loading: { ...state.loading, togglingActive: true },
        }));
        try {
          const updatedUser = await AdminUserService.toggleActive(id);

          if (get().selectedUser?.id === id) {
            set({ selectedUser: updatedUser });
          }

          toast.success("Estado del usuario actualizado");
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({
            loading: { ...state.loading, togglingActive: false },
          }));
        }
      },

      addRole: async (id: number, role: UserRole) => {
        set((state) => ({ loading: { ...state.loading, addingRole: true } }));
        try {
          const updatedUser = await AdminUserService.addRole(id, role);

          if (get().selectedUser?.id === id) {
            set({ selectedUser: updatedUser });
          }

          toast.success("Rol agregado exitosamente");
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({
            loading: { ...state.loading, addingRole: false },
          }));
        }
      },

      removeRole: async (id: number, role: UserRole) => {
        set((state) => ({ loading: { ...state.loading, removingRole: true } }));
        try {
          const updatedUser = await AdminUserService.removeRole(id, role);

          if (get().selectedUser?.id === id) {
            set({ selectedUser: updatedUser });
          }

          toast.success("Rol removido exitosamente");
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({
            loading: { ...state.loading, removingRole: false },
          }));
        }
      },

      fetchCurators: async (projectId: number) => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const curators = await AdminUserService.getCuratorsWithStats(
            projectId
          );
          set({ curators });
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      exportUsers: async (filters?: any) => {
        set((state) => ({ loading: { ...state.loading, exporting: true } }));
        try {
          const blob = await AdminUserService.exportUsers(filters);
          return blob;
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, exporting: false } }));
        }
      },

      exportAllUsers: async () => {
        set((state) => ({ loading: { ...state.loading, exporting: true } }));
        try {
          const blob = await AdminUserService.exportAllUsers();
          return blob;
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, exporting: false } }));
        }
      },

      importUsers: async (file: File) => {
        set((state) => ({ loading: { ...state.loading, importing: true } }));
        try {
          const result = await AdminUserService.importUsers(file);

          toast.success(
            `${result.successfulImports} usuarios importados exitosamente`
          );

          return result;
        } catch (error: any) {
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, importing: false } }));
        }
      },

      setSelectedUser: (user: User | null) => {
        set({ selectedUser: user });
      },
    }),
    "AdminUsersStore"
  )
);
