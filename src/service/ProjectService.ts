import type {
  PaginatedResponse,
  Statistics,
} from "@/shared/interface/PaginatedResponse";
import api from "./api";
import type {
  ProjectDto,
  ProjectSaveDto,
  ProjectStatus,
  ReviewNotesDto,
} from "@/shared/types/projectTypes";

export interface ProjectSearchFilters {
  searchTerm?: string;
  status?: ProjectStatus;
  creatorId?: number;
  curatorId?: number;
  
  // Fechas del proyecto
  projectStartFrom?: string;
  projectStartTo?: string;
  projectEndFrom?: string;
  projectEndTo?: string;
  
  // Fechas de votación
  votingStartFrom?: string;
  votingStartTo?: string;
  votingEndFrom?: string;
  votingEndTo?: string;
  
  // Fecha de creación del registro
  createdFrom?: string;
  createdTo?: string;
  
  // Paginación y ordenamiento
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

class ProjectService {
  private buildQueryParams(filters: ProjectSearchFilters): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const finalValue =
          key === "searchTerm" && typeof value === "string"
            ? value.trim()
            : value;

        if (finalValue !== "") {
          params.append(key, String(finalValue));
        }
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
      ? `/api/v1/projects/search?${queryString}`
      : `/api/v1/projects/search`;

    const response = await api.get(endpoint);
    return response.data;
  }

  async exportProjects(
    filters: ProjectSearchFilters,
    format: "csv" | "excel" = "csv"
  ): Promise<Blob> {
    const params = this.buildQueryParams(filters);
    params.append("format", format);

    const response = await api.get(
      `/api/v1/projects/export?${params.toString()}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  async getProjectById(id: number): Promise<ProjectDto> {
    const response = await api.get(`/api/v1/projects/${id}`);
    return response.data;
  }

  async createProject(projectData: ProjectSaveDto): Promise<ProjectDto> {
    const response = await api.post("/api/v1/projects", projectData);
    return response.data;
  }

  async updateProject(
    id: number,
    projectData: ProjectSaveDto
  ): Promise<ProjectDto> {
    const response = await api.put(`/api/v1/projects/${id}`, projectData);
    return response.data;
  }

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/api/v1/projects/${id}`);
  }

  async assignCurator(
    projectId: number,
    curatorId: number
  ): Promise<ProjectDto> {
    const response = await api.put(
      `/api/v1/projects/${projectId}/curator`,
      null,
      { params: { curatorId } }
    );
    return response.data;
  }

  async addObservations(projectId: number, notes: string): Promise<ProjectDto> {
    const body: ReviewNotesDto = { notes };
    const response = await api.put(
      `/api/v1/projects/${projectId}/observations`,
      body
    );
    return response.data;
  }

  async approveProject(
    projectId: number,
    approval: { votingStartAt: string; votingEndAt: string }
  ): Promise<ProjectDto> {
    const response = await api.put(
      `/api/v1/projects/${projectId}/approve`,
      approval
    );
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
      ? `/api/v1/projects/statistics?${params.toString()}`
      : `/api/v1/projects/statistics`;

    const response = await api.get(endpoint);
    return response.data;
  }

  async getMyCuratedProjects(status?: ProjectStatus): Promise<ProjectDto[]> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const endpoint = params.toString()
      ? `/api/v1/projects/my-curated?${params.toString()}`
      : `/api/v1/projects/my-curated`;

    const response = await api.get(endpoint);
    return response.data;
  }

  async getReadyToPublishProjects(): Promise<ProjectDto[]> {
    const response = await api.get("/api/v1/projects/ready-to-publish");
    return response.data;
  }

  async submitProject(id: number): Promise<ProjectDto> {
    const response = await api.put(`/api/v1/projects/${id}/submit`);
    return response.data;
  }
  
}

export default new ProjectService();
