import { create } from "zustand";
import { logger } from "../middleware/logger";
import CuratorDashboardService from "@/service/curator/CuratorDashboardService";
import type {
  CuratorDashboardStats,
  CuratorProjectStatusData,
  CuratorReviewTrendData,
  UrgentProjectData,
  CuratorRecentActivity,
} from "@/shared/types/curatorTypes";
import { toast } from "sonner";

interface CuratorDashboardState {
  stats: CuratorDashboardStats | null;
  projectStatus: CuratorProjectStatusData[];
  reviewTrend: CuratorReviewTrendData[];
  urgentProjects: UrgentProjectData[];
  recentActivities: CuratorRecentActivity[];
  loading: boolean;

  // Actions
  fetchDashboardStats: () => Promise<void>;
  fetchProjectStatusDistribution: () => Promise<void>;
  fetchReviewTrend: () => Promise<void>;
  fetchUrgentProjects: (limit?: number) => Promise<void>;
  fetchRecentActivities: (limit?: number) => Promise<void>;
  fetchAll: () => Promise<void>;
}

export const useCuratorDashboardStore = create<CuratorDashboardState>()(
  logger(
    (set) => ({
      stats: null,
      projectStatus: [],
      reviewTrend: [],
      urgentProjects: [],
      recentActivities: [],
      loading: false,

      fetchDashboardStats: async () => {
        set({ loading: true });
        try {
          const stats = await CuratorDashboardService.getDashboardStats();
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
            await CuratorDashboardService.getProjectStatusDistribution();
          set({ projectStatus });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener distribución de estados"
          );
        } finally {
          set({ loading: false });
        }
      },

      fetchReviewTrend: async () => {
        set({ loading: true });
        try {
          const reviewTrend = await CuratorDashboardService.getReviewTrend();
          set({ reviewTrend });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener tendencia de revisiones"
          );
        } finally {
          set({ loading: false });
        }
      },

      fetchUrgentProjects: async (limit: number = 5) => {
        set({ loading: true });
        try {
          const urgentProjects =
            await CuratorDashboardService.getUrgentProjects(limit);
          set({ urgentProjects });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener proyectos urgentes");
        } finally {
          set({ loading: false });
        }
      },

      fetchRecentActivities: async (limit: number = 8) => {
        set({ loading: true });
        try {
          const recentActivities =
            await CuratorDashboardService.getRecentActivities(limit);
          set({ recentActivities });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener actividades recientes"
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
            reviewTrend,
            urgentProjects,
            recentActivities,
          ] = await Promise.all([
            CuratorDashboardService.getDashboardStats(),
            CuratorDashboardService.getProjectStatusDistribution(),
            CuratorDashboardService.getReviewTrend(),
            CuratorDashboardService.getUrgentProjects(),
            CuratorDashboardService.getRecentActivities(),
          ]);

          set({
            stats,
            projectStatus,
            reviewTrend,
            urgentProjects,
            recentActivities,
          });
        } catch (error: any) {
          toast.error(error.message || "Error al cargar dashboard");
        } finally {
          set({ loading: false });
        }
      },
    }),
    "CuratorDashboardStore"
  )
);
