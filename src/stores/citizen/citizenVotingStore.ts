import { create } from "zustand";
import { logger } from "../middleware/logger";
import CitizenVotingService from "@/service/citizen/CitizenVotingService";
import type { CitizenVotingStats } from "@/shared/types/votingTypes";
import { toast } from "sonner";

interface LoadingState {
  voting: boolean;
  fetchingStats: boolean;
}

interface CitizenVotingState {
  citizenStats: CitizenVotingStats | null;
  loading: LoadingState;

  // Actions
  voteOnProject: (projectId: number, decision: boolean) => Promise<boolean>;
  fetchCitizenVotingStats: () => Promise<void>;
}

const initialLoadingState: LoadingState = {
  voting: false,
  fetchingStats: false,
};

export const useCitizenVotingStore = create<CitizenVotingState>()(
  logger(
    (set) => ({
      citizenStats: null,
      loading: initialLoadingState,

      voteOnProject: async (projectId: number, decision: boolean) => {
        set((state) => ({ loading: { ...state.loading, voting: true } }));
        try {
          await CitizenVotingService.voteOnProject(projectId, decision);
          toast.success(
            decision
              ? "Voto a favor registrado exitosamente"
              : "Voto en contra registrado exitosamente"
          );
          return true;
        } catch (error: any) {
          toast.error(error.message || "Error al registrar voto");
          return false;
        } finally {
          set((state) => ({ loading: { ...state.loading, voting: false } }));
        }
      },

      fetchCitizenVotingStats: async () => {
        set((state) => ({
          loading: { ...state.loading, fetchingStats: true },
        }));
        try {
          const stats = await CitizenVotingService.getCitizenVotingStats();
          set({ citizenStats: stats });
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
    }),
    "CitizenVotingStore"
  )
);
