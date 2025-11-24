import api from "./api";
import type { CuratorInfoDto, User, UserRole } from "@/shared/types/userTYpes";
import type { BulkUserImportResult } from "@/shared/interface/ImporAndExport";
import type { PagedResponse, PaginatedResponse, Statistics } from "@/shared/interface/PaginatedResponse";
import type { ProjectDto, ProjectStatus } from "@/shared/types/projectTypes";

export interface ProjectSearchFilters {
  searchTerm?: string;
  status?: ProjectStatus;
  creatorId?: number;
  curatorId?: number;

  
  projectStartFrom?: string;
  projectStartTo?: string;
  projectEndFrom?: string;
  projectEndTo?: string;

 
  votingStartFrom?: string;
  votingStartTo?: string;
  votingEndFrom?: string;
  votingEndTo?: string;


  createdFrom?: string;
  createdTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}


class AdminService {
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
  }): Promise<User | PagedResponse<User>> {
    const params = new URLSearchParams();

    if (filters?.email) {
      params.append("email", filters.email);
      const response = await api.get(
        `/api/v1/admin/users?${params.toString()}`
      );
      return response.data;
    }

    if (filters?.nationalId) {
      params.append("nationalId", filters.nationalId);
      const response = await api.get(
        `/api/v1/admin/users?${params.toString()}`
      );
      return response.data;
    }

    if (filters?.name) params.append("name", filters.name);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.active !== undefined)
      params.append("active", filters.active.toString());

    if (filters?.page !== undefined)
      params.append("page", filters.page.toString());
    if (filters?.size !== undefined)
      params.append("size", filters.size.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortDirection)
      params.append("sortDirection", filters.sortDirection);

    const query = params.toString();
    const response = await api.get(
      `/api/v1/admin/users${query ? `?${query}` : ""}`
    );
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
    const response = await api.post("/api/v1/admin/users", data);
    return response.data;
  }

  async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ): Promise<User> {
    const response = await api.put(`/api/v1/admin/user/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<string> {
    const response = await api.delete(`/api/v1/admin/user/${id}`);
    return response.data;
  }

  async addRole(id: number, role: UserRole): Promise<User> {
    const response = await api.post(`/api/v1/admin/user/${id}/roles/${role}`);
    return response.data;
  }

  async removeRole(id: number, role: UserRole): Promise<User> {
    const response = await api.delete(`/api/v1/admin/user/${id}/roles/${role}`);
    return response.data;
  }

  async toggleActive(id: number): Promise<User> {
    const response = await api.patch(`/api/v1/admin/user/${id}/toggle-status`);
    return response.data;
  }

  async exportUsers(filters?: {
    name?: string;
    role?: string;
    active?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters?.name) params.append("name", filters.name);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.active !== undefined)
      params.append("active", filters.active.toString());
    if (filters?.page !== undefined)
      params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortDirection)
      params.append("sortDirection", filters.sortDirection);

    const query = params.toString();
    const response = await api.get(
      `/api/v1/admin/users/export${query ? `?${query}` : ""}`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  }

  async exportAllUsers(): Promise<Blob> {
    const response = await api.get("/api/v1/admin/users/export/all", {
      responseType: "blob",
    });
    return response.data;
  }

  async importUsers(file: File): Promise<BulkUserImportResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/v1/admin/users/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async getCuratorsWithStats(projectId: number): Promise<CuratorInfoDto> {
    const response = await api.get(`/api/v1/admin/users/curators/${projectId}`);
    return response.data;
  }

  private buildQueryParams(filters: any): URLSearchParams {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return params;
  }

  async searchProjects(
    filters: ProjectSearchFilters
  ): Promise<PaginatedResponse<ProjectDto>> {
    const params = this.buildQueryParams(filters);
    const queryString = params.toString();

    const endpoint = queryString
      ? `/api/v1/admin/projects/search?${queryString}`
      : `/api/v1/admin/projects/search`;

    const response = await api.get(endpoint);
    return response.data;
  }

  async getProjectStatistics(
    month?: number,
    year?: number
  ): Promise<Statistics<ProjectDto>> {
    const params = new URLSearchParams();

    if (month !== undefined) params.append("month", String(month));
    if (year !== undefined) params.append("year", String(year));

    const endpoint = params.toString()
      ? `/api/v1/admin/projects/statistics?${params.toString()}`
      : `/api/v1/admin/projects/statistics`;

    const response = await api.get(endpoint);
    return response.data;
  }

  async assignCurator(
      projectId: number,
      curatorId: number
    ): Promise<ProjectDto> {
      const response = await api.put(
        `/api/v1/admin/project/${projectId}/curator`,
        null,
        { params: { curatorId } }
      );
      return response.data;
    }

    async deleteProject(id: number): Promise<void> {
      await api.delete(`/api/v1/projects/${id}`);
    }
  
  


}

export default new AdminService();
