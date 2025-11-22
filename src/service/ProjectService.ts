import api, { votingApi } from "./api";
import type {
  ProjectDto,
  ProjectSaveDto,
  ProjectReadyDto,
  ProjectVotingDto,
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

  async getReadyToPublishProjects(): Promise<ProjectDto[]> {
    const response = await api.get("/api/v1/projects/ready-to-publish");
    return response.data;
  }


  async getReadyToPublishNotOpen(): Promise<ProjectReadyDto[]> {
    const response = await api.get("/api/v1/projects/ready-not-open");
    return response.data;
  }


  async getOpenForVoting(): Promise<ProjectVotingDto[]> {
    const response = await api.get("/api/v1/projects/open-for-voting");
    return response.data;
  }

  async submitProject(id: number): Promise<ProjectDto> {
    const response = await api.put(`/api/v1/projects/${id}/submit`);
    return response.data;
  }

  async voteOnProject(projectId: number, decision: boolean): Promise<void> {
    const response = await votingApi.post(`/votaciones/${projectId}`, {
      decision,
    });
    return response.data;
  }
}

export default new ProjectService();