import api from "../api";
import type { CitizenVotingStats } from "@/shared/types/votingTypes";

class CitizenVotingService {
  async voteOnProject(projectId: number, decision: boolean): Promise<void> {
    const response = await api.post(`/api/v1/citizen/voting/votaciones/${projectId}`, {
      decision,
    });
    return response.data;
  }

  async getCitizenVotingStats(): Promise<CitizenVotingStats> {
    const response = await api.get("/api/v1/citizen/voting/stats");
    return response.data;
  }
}

export default new CitizenVotingService();
