import api from "../api";
import type {
  PaginatedResponse,
} from "@/shared/interface/PaginatedResponse";
import type { ProjectDto, ProjectStatus } from "@/shared/types/projectTypes";
import type { Statistics } from "@/shared/interface/PaginatedResponse";


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

class AdminProjectService {
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

    return (await api.get(endpoint)).data;
  }

  async assignCurator(
    projectId: number,
    curatorId: number
  ): Promise<ProjectDto> {
    return (
      await api.put(`/api/v1/admin/project/${projectId}/curator`, null, {
        params: { curatorId },
      })
    ).data;
  }

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/api/v1/projects/${id}`);
  }

  async getProjectStatistics(
    month?: number,
    year?: number
  ): Promise<Statistics<ProjectDto>> {
    const params = new URLSearchParams();

    if (month !== undefined) params.append("month", String(month));
    if (year !== undefined) params.append("year", String(year));

    const endpoint = params.toString()
      ? `/api/v1/admin/projects/statistics?${params}`
      : `/api/v1/admin/projects/statistics`;

    return (await api.get(endpoint)).data;
  }
}

export default new AdminProjectService();
