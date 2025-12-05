import { create } from "zustand";
import { logger } from "../middleware/logger";
import AdminVotingService from "@/service/admin/AdminVotingService";
import type { VotingProjectDto, VotingStats } from "@/shared/types/votingTypes";
import { toast } from "sonner";

interface LoadingState {
  fetching: boolean;
  fetchingStats: boolean;
  fetchingHistory: boolean;
  fetchingResults: boolean;
}

interface AdminVotingState {
  projects: VotingProjectDto[];
  stats: VotingStats | null;
  votingHistory: VotingProjectDto[];
  votingResults: VotingProjectDto[];
  loading: LoadingState;

  // Actions
  fetchVotingProjects: () => Promise<void>;
  fetchVotingStatistics: () => Promise<void>;
  fetchOpenVotingProjects: () => Promise<void>;
  fetchClosedVotingProjects: () => Promise<void>;
  fetchVotingHistory: () => Promise<void>;
  fetchClosedVotingResults: () => Promise<void>;
}

const initialLoadingState: LoadingState = {
  fetching: false,
  fetchingStats: false,
  fetchingHistory: false,
  fetchingResults: false,
};

export const useAdminVotingStore = create<AdminVotingState>()(
  logger(
    (set) => ({
      projects: [],
      stats: null,
      votingHistory: [],
      votingResults: [],
      loading: initialLoadingState,

      fetchVotingProjects: async () => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const projects = await AdminVotingService.getVotingProjects();
          set({ projects });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener proyectos en votación"
          );
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      fetchVotingStatistics: async () => {
        set((state) => ({
          loading: { ...state.loading, fetchingStats: true },
        }));
        try {
          const stats = await AdminVotingService.getVotingStatistics();
          set({ stats });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener estadísticas de votación"
          );
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingStats: false },
          }));
        }
      },

      fetchOpenVotingProjects: async () => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const projects = await AdminVotingService.getOpenVotingProjects();
          set({ projects });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener votaciones abiertas");
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      fetchClosedVotingProjects: async () => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const projects = await AdminVotingService.getClosedVotingProjects();
          set({ projects });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener votaciones cerradas");
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      fetchVotingHistory: async () => {
        set((state) => ({
          loading: { ...state.loading, fetchingHistory: true },
        }));
        try {
          const history = await AdminVotingService.getVotingHistory();
          set({ votingHistory: history });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener historial de votaciones"
          );
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingHistory: false },
          }));
        }
      },

      fetchClosedVotingResults: async () => {
        set((state) => ({
          loading: { ...state.loading, fetchingResults: true },
        }));
        try {
          const results = await AdminVotingService.getClosedVotingResults();
          set({ votingResults: results });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener resultados de votaciones"
          );
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingResults: false },
          }));
        }
      },
    }),
    "AdminVotingStore"
  )
);
