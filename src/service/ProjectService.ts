import api from "./api";
import type {
  ProjectDto,
  ProjectSaveDto,
  ProjectStatus,
  ReviewNotesDto,
} from "@/shared/types/projectTypes";


class ProjectService {
 
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
