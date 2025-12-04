import { createContext, useState, useCallback } from "react";
import { toast } from "sonner";
import type { ReactNode } from "react";
import type {
  LoadingRoleState,
  Permission,
  Role,
} from "@/shared/types/PermissionTypes";
import PermissionService from "@/service/admin/PermissionService";

type PermissionContextType = {
  roles: Role[];
  permissions: Permission[];
  selectedRole: Role | null;
  loading: LoadingRoleState;
  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  getRoleById: (id: number) => Promise<void>;
  updateRolePermissions: (id: number, codes: string[]) => Promise<void>;
  addPermissionToRole: (id: number, code: string) => Promise<void>;
  removePermissionFromRole: (id: number, code: string) => Promise<void>;
  setSelectedRole: (role: Role | null) => void;
  refreshRoles: () => Promise<void>;
};

export const PermissionContext = createContext<PermissionContextType | null>(
  null
);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [loading, setLoading] = useState<LoadingRoleState>({
    fetchingRoles: false,
    fetchingPermissions: false,
    fetchingRole: false,
    updatingRole: false,
  });

  const updateLoading = useCallback(
    (key: keyof LoadingRoleState, value: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleError = useCallback(
    (error: any, defaultMessage: string, retryAction: () => void) => {
      const errorMessage =
        error.response?.data?.message || error.message || defaultMessage;
      toast.error(errorMessage, {
        action: {
          label: "Reintentar",
          onClick: retryAction,
        },
      });
    },
    []
  );

  const fetchRoles = useCallback(async () => {
    updateLoading("fetchingRoles", true);
    try {
      const data = await PermissionService.getAllRoles();
      setRoles(data);
    } catch (err: any) {
      handleError(err, "Error al obtener roles", fetchRoles);
    } finally {
      updateLoading("fetchingRoles", false);
    }
  }, [updateLoading]);

  const fetchPermissions = useCallback(async () => {
    updateLoading("fetchingPermissions", true);
    try {
      const data = await PermissionService.getAllPermissions();
      setPermissions(data);
    } catch (err: any) {
      handleError(err, "Error al obtener permisos", fetchPermissions);
    } finally {
      updateLoading("fetchingPermissions", false);
    }
  }, [updateLoading]);

  const getRoleById = useCallback(
    async (id: number) => {
      updateLoading("fetchingRole", true);
      try {
        const data = await PermissionService.getRoleById(id);
        setSelectedRole(data);
      } catch (err: any) {
        handleError(err, "Error al obtener rol", () => getRoleById(id));
      } finally {
        updateLoading("fetchingRole", false);
      }
    },
    [updateLoading]
  );

  const updateRolePermissions = useCallback(
    async (id: number, codes: string[]) => {
      updateLoading("updatingRole", true);
      try {
        const updated = await PermissionService.updateRolePermissions(
          id,
          codes
        );
        toast.success("Permisos actualizados correctamente");
        setSelectedRole(updated);
        await fetchRoles();
      } catch (err: any) {
        handleError(err, "Error al actualizar permisos", () =>
          updateRolePermissions(id, codes)
        );
      } finally {
        updateLoading("updatingRole", false);
      }
    },
    [fetchRoles, updateLoading]
  );

  const addPermissionToRole = useCallback(
    async (id: number, code: string) => {
      updateLoading("updatingRole", true);
      try {
        const updated = await PermissionService.addPermissionToRole(id, code);
        toast.success(`Permiso ${code} agregado`);
        setSelectedRole(updated);
        await fetchRoles();
      } catch (err: any) {
        handleError(err, "Error al agregar permiso", () =>
          addPermissionToRole(id, code)
        );
      } finally {
        updateLoading("updatingRole", false);
      }
    },
    [fetchRoles, updateLoading]
  );

  const removePermissionFromRole = useCallback(
    async (id: number, code: string) => {
      updateLoading("updatingRole", true);
      try {
        const updated = await PermissionService.removePermissionFromRole(
          id,
          code
        );
        toast.success(`Permiso ${code} removido`);
        setSelectedRole(updated);
        await fetchRoles();
      } catch (err: any) {
        handleError(err, "Error al remover permiso", () =>
          removePermissionFromRole(id, code)
        );
      } finally {
        updateLoading("updatingRole", false);
      }
    },
    [fetchRoles, updateLoading]
  );

  const refreshRoles = useCallback(async () => {
    await fetchRoles();
  }, [fetchRoles]);

  return (
    <PermissionContext.Provider
      value={{
        roles,
        permissions,
        selectedRole,
        loading,
        fetchRoles,
        fetchPermissions,
        getRoleById,
        updateRolePermissions,
        addPermissionToRole,
        removePermissionFromRole,
        setSelectedRole,
        refreshRoles,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
