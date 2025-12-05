import { create } from "zustand";
import { logger } from "../middleware/logger";
import CitizenProjectService from "@/service/citizen/CitizenProjectService";
import type {
  ProjectDto,
  ProjectReadyDto,
  ProjectVotingDto,
} from "@/shared/types/projectTypes";
import { toast } from "sonner";

interface LoadingState {
  fetching: boolean;
  fetchingDetails: boolean;
}

interface CitizenProjectState {
  selectedProject: ProjectDto | null;
  readyProjects: ProjectReadyDto[];
  votingProjects: ProjectVotingDto[];
  loading: LoadingState;

  // Actions
  getProjectById: (id: number) => Promise<ProjectDto | null>;
  fetchReadyToPublishNotOpen: () => Promise<void>;
  fetchOpenForVoting: () => Promise<void>;
  setSelectedProject: (project: ProjectDto | null) => void;
}

const initialLoadingState: LoadingState = {
  fetching: false,
  fetchingDetails: false,
};

export const useCitizenProjectStore = create<CitizenProjectState>()(
  logger(
    (set) => ({
      selectedProject: null,
      readyProjects: [],
      votingProjects: [],
      loading: initialLoadingState,

      getProjectById: async (id: number) => {
        set((state) => ({
          loading: { ...state.loading, fetchingDetails: true },
        }));
        try {
          const project = await CitizenProjectService.getProjectById(id);
          set({ selectedProject: project });
          return project;
        } catch (error: any) {
          toast.error(error.message || "Error al obtener proyecto");
          return null;
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingDetails: false },
          }));
        }
      },

      fetchReadyToPublishNotOpen: async () => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const projects =
            await CitizenProjectService.getReadyToPublishNotOpen();
          set({ readyProjects: projects });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener proyectos listos");
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      fetchOpenForVoting: async () => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const projects = await CitizenProjectService.getOpenForVoting();
          set({ votingProjects: projects });
        } catch (error: any) {
          toast.error(
            error.message || "Error al obtener proyectos en votación"
          );
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      setSelectedProject: (project: ProjectDto | null) => {
        set({ selectedProject: project });
      },
    }),
    "CitizenProjectStore"
  )
);
