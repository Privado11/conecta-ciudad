import { create } from "zustand";
import { logger } from "../middleware/logger";
import AdminDashboardService from "@/service/admin/AdminDashboardService";
import type {
  DashboardStats,
  ProjectStatusData,
  ProjectTrendData,
  VotingActivityData,
  RecentActivity,
  UserRoleDistribution,
} from "@/service/admin/AdminDashboardService";
import { toast } from "sonner";

interface AdminDashboardState {
  stats: DashboardStats | null;
  projectStatus: ProjectStatusData[];
  projectTrend: ProjectTrendData[];
  votingActivity: VotingActivityData[];
  recentActivity: RecentActivity[];
  userRoleDistribution: UserRoleDistribution[];
  loading: boolean;

  // Actions
  fetchStatistics: () => Promise<void>;
  fetchProjectStatusDistribution: () => Promise<void>;
  fetchProjectTrend: () => Promise<void>;
  fetchActiveVotaciones: () => Promise<void>;
  fetchRecentActivity: (limit?: number) => Promise<void>;
  fetchUserRoleDistribution: () => Promise<void>;
  fetchAll: () => Promise<void>;
}

export const useAdminDashboardStore = create<AdminDashboardState>()(
  logger(
    (set) => ({
      stats: null,
      projectStatus: [],
      projectTrend: [],
      votingActivity: [],
      recentActivity: [],
      userRoleDistribution: [],
      loading: false,

      fetchStatistics: async () => {
        set({ loading: true });
        try {
          const stats = await AdminDashboardService.getStatistics();
          set({ stats });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener estadísticas");
        } finally {
          set({ loading: false });
        }
      },

      fetchProjectStatusDistribution: async () => {
        set({ loading: true });
        try {
          const projectStatus =
            await AdminDashboardService.getProjectStatusDistribution();
          set({ projectStatus });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener distribución de estados"
          );
        } finally {
          set({ loading: false });
        }
      },

      fetchProjectTrend: async () => {
        set({ loading: true });
        try {
          const projectTrend = await AdminDashboardService.getProjectTrend();
          set({ projectTrend });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener tendencia de proyectos"
          );
        } finally {
          set({ loading: false });
        }
      },

      fetchActiveVotaciones: async () => {
        set({ loading: true });
        try {
          const votingActivity =
            await AdminDashboardService.getActiveVotaciones();
          set({ votingActivity });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener votaciones activas");
        } finally {
          set({ loading: false });
        }
      },

      fetchRecentActivity: async (limit: number = 10) => {
        set({ loading: true });
        try {
          const recentActivity = await AdminDashboardService.getRecentActivity(
            limit
          );
          set({ recentActivity });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener actividad reciente");
        } finally {
          set({ loading: false });
        }
      },

      fetchUserRoleDistribution: async () => {
        set({ loading: true });
        try {
          const userRoleDistribution =
            await AdminDashboardService.getUserRoleDistribution();
          set({ userRoleDistribution });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener distribución de roles"
          );
        } finally {
          set({ loading: false });
        }
      },

      fetchAll: async () => {
        set({ loading: true });
        try {
          const [
            stats,
            projectStatus,
            projectTrend,
            votingActivity,
            recentActivity,
            userRoleDistribution,
          ] = await Promise.all([
            AdminDashboardService.getStatistics(),
            AdminDashboardService.getProjectStatusDistribution(),
            AdminDashboardService.getProjectTrend(),
            AdminDashboardService.getActiveVotaciones(),
            AdminDashboardService.getRecentActivity(),
            AdminDashboardService.getUserRoleDistribution(),
          ]);

          set({
            stats,
            projectStatus,
            projectTrend,
            votingActivity,
            recentActivity,
            userRoleDistribution,
          });
        } catch (error: any) {
          toast.error(error.message || "Error al cargar dashboard");
        } finally {
          set({ loading: false });
        }
      },
    }),
    "AdminDashboardStore"
  )
);
