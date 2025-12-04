import api from "../api";
import type {
  ProjectDto,
  ProjectSaveDto,

} from "@/shared/types/projectTypes";

class LeaderProjectService {
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

  async submitProject(id: number): Promise<ProjectDto> {
    const response = await api.put(`/api/v1/projects/${id}/submit`);
    return response.data;
  }

}

export default new LeaderProjectService();
