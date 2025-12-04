import api from "../api";
import type { ProjectDto, ProjectStatus } from "@/shared/types/projectTypes";

class CuratorProjectService {
  async addObservations(projectId: number, notes: string): Promise<ProjectDto> {
    return (
      await api.put(`/api/v1/curator/project/${projectId}/observations`, {
        notes,
      })
    ).data;
  }

  async approveProject(
    projectId: number,
    approval: { votingStartAt: string; votingEndAt: string }
  ): Promise<ProjectDto> {
    return (
      await api.put(`/api/v1/curator/project/${projectId}/approve`, approval)
    ).data;
  }

  async getMyCuratedProjects(status?: ProjectStatus): Promise<ProjectDto[]> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const url = params.toString()
      ? `/api/v1/curator/projects/my-curated?${params}`
      : `/api/v1/curator/projects/my-curated`;

    return (await api.get(url)).data;
  }
}

export default new CuratorProjectService();
