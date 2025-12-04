import type { Permission, Role } from "@/shared/types/PermissionTypes";
import api from "../api";

class PermissionService {
  async getAllRoles(): Promise<Role[]> {
    const response = await api.get("/api/v1/roles");
    return response.data;
  }

  async getAllPermissions(): Promise<Permission[]> {
    const response = await api.get("/api/v1/roles/permissions");
    return response.data;
  }

  async getRoleById(id: number): Promise<Role> {
    const response = await api.get(`/api/v1/roles/${id}`);
    return response.data;
  }

  async updateRolePermissions(
    roleId: number,
    permissionCodes: string[]
  ): Promise<Role> {
    const response = await api.put(
      `/api/v1/roles/${roleId}/permissions`,
      permissionCodes
    );
    return response.data;
  }
  async addPermissionToRole(
    roleId: number,
    permissionCode: string
  ): Promise<Role> {
    const response = await api.post(
      `/api/v1/roles/${roleId}/permissions/${permissionCode}`
    );
    return response.data;
  }
  async removePermissionFromRole(
    roleId: number,
    permissionCode: string
  ): Promise<Role> {
    const response = await api.delete(
      `/api/v1/roles/${roleId}/permissions/${permissionCode}`
    );
    return response.data;
  }
}

export default new PermissionService();
