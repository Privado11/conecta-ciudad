import { create } from "zustand";
import { logger } from "./middleware/logger";
import AdminPermissionService from "@/service/admin/AdminPermissionService";
import type { Permission, Role } from "@/shared/types/PermissionTypes";

interface LoadingState {
  fetchingPermissions: boolean;
  fetchingRoles: boolean;
  updatingRole: boolean;
}

interface PermissionState {
  permissions: Permission[];
  roles: Role[];
  loading: LoadingState;

  // Actions
  fetchPermissions: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  updateRolePermissions: (
    roleId: number,
    permissionCodes: string[]
  ) => Promise<void>;
}

const initialLoadingState: LoadingState = {
  fetchingPermissions: false,
  fetchingRoles: false,
  updatingRole: false,
};

export const usePermissionStore = create<PermissionState>()(
  logger(
    (set, get) => ({
      permissions: [],
      roles: [],
      loading: initialLoadingState,

      fetchPermissions: async () => {
        set((state) => ({
          loading: { ...state.loading, fetchingPermissions: true },
        }));
        try {
          const permissions = await AdminPermissionService.getAllPermissions();
          set({ permissions });
        } catch (error) {
          console.error("Error fetching permissions:", error);
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingPermissions: false },
          }));
        }
      },

      fetchRoles: async () => {
        set((state) => ({
          loading: { ...state.loading, fetchingRoles: true },
        }));
        try {
          const roles = await AdminPermissionService.getAllRoles();
          set({ roles });
        } catch (error) {
          console.error("Error fetching roles:", error);
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingRoles: false },
          }));
        }
      },

      hasPermission: (permissionCode: string): boolean => {
        const { permissions } = get();
        return permissions.some((p) => p.code === permissionCode);
      },

      hasRole: (roleName: string): boolean => {
        const { roles } = get();
        return roles.some((r) => r.name === roleName);
      },

      hasAnyRole: (roleNames: string[]): boolean => {
        const { roles } = get();
        return roles.some((r) => roleNames.includes(r.name));
      },

      updateRolePermissions: async (
        roleId: number,
        permissionCodes: string[]
      ) => {
        set((state) => ({
          loading: { ...state.loading, updatingRole: true },
        }));
        try {
          await AdminPermissionService.updateRolePermissions(
            roleId,
            permissionCodes
          );
          await get().fetchRoles();
        } catch (error) {
          console.error("Error updating role permissions:", error);
          throw error;
        } finally {
          set((state) => ({
            loading: { ...state.loading, updatingRole: false },
          }));
        }
      },
    }),
    "PermissionStore"
  )
);
