import api from "../api";
import type {
  ProjectDto,
  ProjectReadyDto,
  ProjectVotingDto,
} from "@/shared/types/projectTypes";

class CitizenProjectService {
  async getProjectById(id: number): Promise<ProjectDto> {
    const response = await api.get(`/api/v1/projects/${id}`);
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

}

export default new CitizenProjectService();
