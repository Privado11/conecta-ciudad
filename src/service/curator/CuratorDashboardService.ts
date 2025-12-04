import api from "../api";
import type {
  CuratorDashboardStats,
  CuratorProjectStatusData,
  CuratorReviewTrendData,
  UrgentProjectData,
  CuratorRecentActivity,
} from "@/shared/types/curatorTypes";

class CuratorDashboardService {
  async getDashboardStats(): Promise<CuratorDashboardStats> {
    return (await api.get("/api/v1/curator/dashboard/stats")).data;
  }

  async getProjectStatusDistribution(): Promise<CuratorProjectStatusData[]> {
    return (await api.get("/api/v1/curator/dashboard/project-status")).data;
  }

  async getReviewTrend(): Promise<CuratorReviewTrendData[]> {
    return (await api.get("/api/v1/curator/dashboard/review-trend")).data;
  }

  async getUrgentProjects(limit: number = 5): Promise<UrgentProjectData[]> {
    return (
      await api.get("/api/v1/curator/dashboard/urgent-projects", {
        params: { limit },
      })
    ).data;
  }

  async getRecentActivities(
    limit: number = 8
  ): Promise<CuratorRecentActivity[]> {
    return (
      await api.get("/api/v1/curator/dashboard/recent-activities", {
        params: { limit },
      })
    ).data;
  }
}

export default new CuratorDashboardService();
