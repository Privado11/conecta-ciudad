import api from "./api";
import type { VotingProjectDto, VotingStats } from "@/shared/types/votingTypes";

class VotingService {

  async getVotingProjects(): Promise<VotingProjectDto[]> {
    const response = await api.get("/api/v1/admin/voting/projects");
    return response.data;
  }


  async getVotingStatistics(): Promise<VotingStats> {
    const response = await api.get("/api/v1/admin/voting/statistics");
    return response.data;
  }


  async getOpenVotingProjects(): Promise<VotingProjectDto[]> {
    const response = await api.get("/api/v1/admin/voting/projects/open");
    return response.data;
  }


  async getClosedVotingProjects(): Promise<VotingProjectDto[]> {
    const response = await api.get("/api/v1/admin/voting/projects/closed");
    return response.data;
  }
}

export default new VotingService();
