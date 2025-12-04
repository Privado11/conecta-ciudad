import api from "../api";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeVotaciones: number;
  participationRate: number;
  newUsersThisMonth: number;
}

export interface ProjectStatusData {
  status: string;
  count: number;
  color: string;
}

export interface ProjectTrendData {
  month: string;
  projects: number;
}

export interface VotingActivityData {
  id: number;
  projectName: string;
  votes: number;
  endDate: string;
}

export interface RecentActivity {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export interface UserRoleDistribution {
  role: string;
  count: number;
  color: string;
}

class DashboardService {
  async getStatistics(): Promise<DashboardStats> {
    const response = await api.get("/api/v1/admin/dashboard/stats");
    return response.data;
  }

  async getProjectStatusDistribution(): Promise<ProjectStatusData[]> {
    const response = await api.get("/api/v1/admin/dashboard/project-status");
    return response.data;
  }

  async getProjectTrend(): Promise<ProjectTrendData[]> {
    const response = await api.get("/api/v1/admin/dashboard/project-trend");
    return response.data;
  }

  async getActiveVotaciones(): Promise<VotingActivityData[]> {
    const response = await api.get("/api/v1/admin/dashboard/voting-activity");
    return response.data;
  }

  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    const response = await api.get(
      "/api/v1/admin/dashboard/recent-activities",
      {
        params: { limit },
      }
    );
    return response.data;
  }

  async getUserRoleDistribution(): Promise<UserRoleDistribution[]> {
    const response = await api.get(
      "/api/v1/admin/dashboard/user-role-distribution"
    );
    return response.data;
  }
}

export default new DashboardService();
