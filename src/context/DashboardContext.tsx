import DashboardService from "@/service/DashboardService";
import type {
  DashboardStats,
  ProjectStatusData,
  ProjectTrendData,
  VotingActivityData,
  RecentActivity,
  UserRoleDistribution,
} from "@/service/DashboardService";
import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

type DashboardContextType = {
  stats: DashboardStats | null;
  projectStatusData: ProjectStatusData[];
  projectTrendData: ProjectTrendData[];
  votingActivityData: VotingActivityData[];
  recentActivities: RecentActivity[];
  userRoleDistribution: UserRoleDistribution[];
  loading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
};

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projectStatusData, setProjectStatusData] = useState<
    ProjectStatusData[]
  >([]);
  const [projectTrendData, setProjectTrendData] = useState<ProjectTrendData[]>(
    []
  );
  const [votingActivityData, setVotingActivityData] = useState<
    VotingActivityData[]
  >([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [userRoleDistribution, setUserRoleDistribution] = useState<
    UserRoleDistribution[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        statsData,
        statusData,
        trendData,
        votingData,
        activityData,
        roleData,
      ] = await Promise.all([
        DashboardService.getStatistics(),
        DashboardService.getProjectStatusDistribution(),
        DashboardService.getProjectTrend(),
        DashboardService.getActiveVotaciones(),
        DashboardService.getRecentActivity(10),
        DashboardService.getUserRoleDistribution(),
      ]);

      setStats(statsData);
      setProjectStatusData(statusData);
      setProjectTrendData(trendData);
      setVotingActivityData(votingData);
      setRecentActivities(activityData);
      setUserRoleDistribution(roleData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDashboard = async () => {
    await fetchDashboardData();
  };

  const resetDashboardState = useCallback(() => {
    setStats(null);
    setProjectStatusData([]);
    setProjectTrendData([]);
    setVotingActivityData([]);
    setRecentActivities([]);
    setUserRoleDistribution([]);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const handleUserLoggedIn = async () => {
      await fetchDashboardData();
    };

    const handleUserLoggedOut = () => {
      resetDashboardState();
    };

    const user = localStorage.getItem("user");
    if (user) {
      handleUserLoggedIn();
    }

    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    window.addEventListener("userLoggedOut", handleUserLoggedOut);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("userLoggedOut", handleUserLoggedOut);
    };
  }, [fetchDashboardData, resetDashboardState]);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        projectStatusData,
        projectTrendData,
        votingActivityData,
        recentActivities,
        userRoleDistribution,
        loading,
        error,
        refreshDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
