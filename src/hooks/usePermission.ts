import { useState } from "react";
import { usePermissionStore } from "@/stores/permissionStore";
import type { Role } from "@/shared/types/PermissionTypes";

export const usePermission = () => {
  const store = usePermissionStore();
  const [selectedRole, setSelectedRoleState] = useState<Role | null>(null);

  const setSelectedRole = (role: Role | null) => {
    setSelectedRoleState(role);
  };

  const getRoleById = (roleId: number) => {
    const role = store.roles.find((r) => r.id === roleId);
    if (role) {
      setSelectedRoleState(role);
    }
    return role;
  };

  return {
    ...store,
    selectedRole,
    setSelectedRole,
    getRoleById,
  };
};
