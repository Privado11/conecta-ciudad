import type {
  PagedResponse,
  PendingReviewDto,
  PendingReviewQueueDto,
  ReviewHistoryDto,
  ReviewHistoryFilters,
  CuratorDashboardStats,
  CuratorProjectStatusData,
  CuratorReviewTrendData,
  UrgentProjectData,
  CuratorRecentActivity,
} from "@/shared/types/curatorTypes";
import api from "./api";
import type { ProjectDto, ProjectStatus } from "@/shared/types/projectTypes";

class CuratorService {
  async addObservations(projectId: number, notes: string): Promise<ProjectDto> {
    const response = await api.put(
      `/api/v1/curator/project/${projectId}/observations`,
      { notes }
    );
    return response.data;
  }

  async approveProject(
    projectId: number,
    approval: { votingStartAt: string; votingEndAt: string }
  ): Promise<ProjectDto> {
    const response = await api.put(
      `/api/v1/curator/project/${projectId}/approve`,
      approval
    );
    return response.data;
  }

  async getMyCuratedProjects(status?: ProjectStatus): Promise<ProjectDto[]> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const endpoint = params.toString()
      ? `/api/v1/curator/projects/my-curated?${params.toString()}`
      : `/api/v1/curator/projects/my-curated`;

    const response = await api.get(endpoint);
    return response.data;
  }

  async getPendingReviewQueue(): Promise<PendingReviewQueueDto> {
    const response = await api.get("/api/v1/curator/reviews/pending-queue");
    return response.data;
  }

  async getPendingReviewDetails(projectId: number): Promise<PendingReviewDto> {
    const response = await api.get(
      `/api/v1/curator/reviews/pending/${projectId}`
    );
    return response.data;
  }

  async getReviewHistory(
    filters: ReviewHistoryFilters = {}
  ): Promise<PagedResponse<ReviewHistoryDto>> {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters.status) params.append("status", filters.status);
    if (filters.outcome && filters.outcome !== "all")
      params.append("outcome", filters.outcome);
    if (filters.wasOverdue !== undefined)
      params.append("wasOverdue", String(filters.wasOverdue));
    if (filters.isResubmission !== undefined)
      params.append("isResubmission", String(filters.isResubmission));
    if (filters.reviewedFrom)
      params.append("reviewedFrom", filters.reviewedFrom);
    if (filters.reviewedTo) params.append("reviewedTo", filters.reviewedTo);

    params.append("page", String(filters.page ?? 0));
    params.append("size", String(filters.size ?? 10));
    params.append("sortBy", filters.sortBy ?? "reviewedAt");
    params.append("sortDir", filters.sortDir ?? "desc");

    const response = await api.get(
      `/api/v1/curator/reviews/history?${params.toString()}`
    );
    return response.data;
  }

  async getDashboardStats(): Promise<CuratorDashboardStats> {
    const response = await api.get("/api/v1/curator/dashboard/stats");
    return response.data;
  }

  async getProjectStatusDistribution(): Promise<CuratorProjectStatusData[]> {
    const response = await api.get("/api/v1/curator/dashboard/project-status");
    return response.data;
  }

  async getReviewTrend(): Promise<CuratorReviewTrendData[]> {
    const response = await api.get("/api/v1/curator/dashboard/review-trend");
    return response.data;
  }

  async getUrgentProjects(limit: number = 5): Promise<UrgentProjectData[]> {
    const response = await api.get("/api/v1/curator/dashboard/urgent-projects", {
      params: { limit },
    });
    return response.data;
  }

  async getRecentActivities(limit: number = 8): Promise<CuratorRecentActivity[]> {
    const response = await api.get("/api/v1/curator/dashboard/recent-activities", {
      params: { limit },
    });
    return response.data;
  }
}

export default new CuratorService();
