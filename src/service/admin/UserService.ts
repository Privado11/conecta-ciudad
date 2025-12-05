import api from "../api";
import type { User, UserRole, CuratorInfoDto } from "@/shared/types/userTYpes";
import type { PagedResponse } from "@/shared/interface/PaginatedResponse";
import type { BulkUserImportResult } from "@/shared/interface/ImporAndExport";

class UserService {
  async getUsers(filters?: any): Promise<User | PagedResponse<User>> {
    const params = new URLSearchParams();

    if (filters?.email) {
      params.append("email", filters.email);
      return (await api.get(`/api/v1/admin/users?${params}`)).data;
    }

    if (filters?.nationalId) {
      params.append("nationalId", filters.nationalId);
      return (await api.get(`/api/v1/admin/users?${params}`)).data;
    }

    if (filters?.name) params.append("name", filters.name);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.active !== undefined)
      params.append("active", String(filters.active));

    if (filters?.page !== undefined)
      params.append("page", String(filters.page));
    if (filters?.size !== undefined)
      params.append("size", String(filters.size));
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortDirection)
      params.append("sortDirection", filters.sortDirection);

    const query = params.toString();
    return (await api.get(`/api/v1/admin/users${query ? `?${query}` : ""}`))
      .data;
  }

  async createUser(data: any): Promise<User> {
    return (await api.post("/api/v1/admin/users", data)).data;
  }

  async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ): Promise<User> {
    return (await api.put(`/api/v1/admin/user/${id}`, data)).data;
  }

  async deleteUser(id: number): Promise<string> {
    return (await api.delete(`/api/v1/admin/user/${id}`)).data;
  }

  async addRole(id: number, role: UserRole): Promise<User> {
    return (await api.post(`/api/v1/admin/user/${id}/roles/${role}`)).data;
  }

  async removeRole(id: number, role: UserRole): Promise<User> {
    return (await api.delete(`/api/v1/admin/user/${id}/roles/${role}`)).data;
  }

  async toggleActive(id: number): Promise<User> {
    return (await api.patch(`/api/v1/admin/user/${id}/toggle-status`)).data;
  }

  async exportUsers(filters?: any): Promise<Blob> {
    const params = new URLSearchParams(filters || {});
    return (
      await api.get(`/api/v1/admin/users/export?${params}`, {
        responseType: "blob",
      })
    ).data;
  }

  async exportAllUsers(): Promise<Blob> {
    return (
      await api.get("/api/v1/admin/users/export/all", { responseType: "blob" })
    ).data;
  }

  async importUsers(file: File): Promise<BulkUserImportResult> {
    const formData = new FormData();
    formData.append("file", file);

    return (
      await api.post("/api/v1/admin/users/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  }

  async getCuratorsWithStats(projectId: number): Promise<CuratorInfoDto> {
    return (await api.get(`/api/v1/admin/users/curators/${projectId}`)).data;
  }
}

export default new UserService();
