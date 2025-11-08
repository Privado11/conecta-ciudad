import type { User, UserRole } from "@/shared/types/userTYpes";
import api from "./api";
import type { PaginatedResponse } from "@/shared/interface/PaginatedResponse";

class UserService {
  async getUsers(filters?: {
    name?: string;
    email?: string;
    nationalId?: string;
    role?: string;
    active?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }): Promise<User[] | PaginatedResponse<User>> {
    const params = new URLSearchParams();

    if (filters?.email) {
      params.append("email", filters.email);
      const response = await api.get(`/api/v1/users?${params.toString()}`);
      return response.data;
    }

    if (filters?.nationalId) {
      params.append("nationalId", filters.nationalId);
      const response = await api.get(`/api/v1/users?${params.toString()}`);
      return response.data;
    }

   if (filters?.name) params.append("name", filters.name);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.active !== undefined) params.append("active", filters.active.toString());
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortDirection) params.append("sortDirection", filters.sortDirection);

    const query = params.toString();
    const response = await api.get(`/api/v1/users${query ? `?${query}` : ""}`);
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    nationalId: string;
    phone?: string;
    roles: string[];
  }): Promise<User> {
    const response = await api.post("/api/v1/users", data);
    return response.data;
  }

  async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ): Promise<User> {
    const response = await api.put(`/api/v1/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<string> {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }

  async addRole(id: number, role: UserRole): Promise<User> {
    const response = await api.post(`/api/v1/users/${id}/roles/${role}`);
    return response.data;
  }

  async removeRole(id: number, role: UserRole): Promise<User> {
    const response = await api.delete(`/api/v1/users/${id}/roles/${role}`);
    return response.data;
  }

  async toggleActive(id: number): Promise<User> {
    const response = await api.patch(`/api/v1/users/${id}/toggle-status`);
    return response.data;
  }

  async validateUniqueFields(params: {
    email?: string;
    nationalId?: string;
  }): Promise<{ available: boolean; message: string }> {
    const query = new URLSearchParams();
  
    if (params.email) query.append("email", params.email);
    if (params.nationalId) query.append("nationalId", params.nationalId);
  
    const response = await api.get(`/api/v1/users/validate?${query.toString()}`);
    return response.data;
  }
  
}

export default new UserService();
