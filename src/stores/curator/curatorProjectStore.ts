import { create } from "zustand";
import { logger } from "../middleware/logger";
import CuratorProjectService from "@/service/curator/CuratorProjectService";
import type { ProjectDto, ProjectStatus } from "@/shared/types/projectTypes";
import { toast } from "sonner";

interface LoadingState {
  fetching: boolean;
  updating: boolean;
  approving: boolean;
  fetchingQueue: boolean;
  approvingProject: boolean;
  addingObservations: boolean;
  fetchingHistory: boolean;
}

interface CuratorProjectState {
  projects: ProjectDto[];
  selectedProject: ProjectDto | null;
  pendingQueue: any | null;
  selectedReview: any | null;
  reviewHistory: any | null;
  loading: LoadingState;

  // Actions
  fetchMyCuratedProjects: (status?: ProjectStatus) => Promise<void>;
  addObservations: (projectId: number, notes: string) => Promise<void>;
  approveProject: (
    projectId: number,
    approval: { votingStartAt: string; votingEndAt: string }
  ) => Promise<void>;
  setSelectedProject: (project: ProjectDto | null) => void;
  getPendingReviewQueue: () => Promise<void>;
  setSelectedReview: (review: any | null) => void;
  getReviewHistory: (filters?: any) => Promise<void>;
}

const initialLoadingState: LoadingState = {
  fetching: false,
  updating: false,
  approving: false,
  fetchingQueue: false,
  approvingProject: false,
  addingObservations: false,
  fetchingHistory: false,
};

export const useCuratorProjectStore = create<CuratorProjectState>()(
  logger(
    (set, get) => ({
      projects: [],
      selectedProject: null,
      pendingQueue: null,
      selectedReview: null,
      reviewHistory: null,
      loading: initialLoadingState,

      fetchMyCuratedProjects: async (status?: ProjectStatus) => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const projects = await CuratorProjectService.getMyCuratedProjects(
            status
          );
          set({ projects });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener proyectos curados");
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      addObservations: async (projectId: number, notes: string) => {
        set((state) => ({
          loading: { ...state.loading, addingObservations: true },
        }));
        try {
          const updatedProject = await CuratorProjectService.addObservations(
            projectId,
            notes
          );

          if (get().selectedProject?.id === projectId) {
            set({ selectedProject: updatedProject });
          }

          toast.success("Observaciones agregadas exitosamente");
        } catch (error: any) {
          toast.error(error.message || "Error al agregar observaciones");
          throw error;
        } finally {
          set((state) => ({
            loading: { ...state.loading, addingObservations: false },
          }));
        }
      },

      approveProject: async (
        projectId: number,
        approval: { votingStartAt: string; votingEndAt: string }
      ) => {
        set((state) => ({
          loading: { ...state.loading, approvingProject: true },
        }));
        try {
          const updatedProject = await CuratorProjectService.approveProject(
            projectId,
            approval
          );

          if (get().selectedProject?.id === projectId) {
            set({ selectedProject: updatedProject });
          }

          toast.success("Proyecto aprobado exitosamente");
        } catch (error: any) {
          toast.error(error.message || "Error al aprobar proyecto");
          throw error;
        } finally {
          set((state) => ({
            loading: { ...state.loading, approvingProject: false },
          }));
        }
      },

      getPendingReviewQueue: async () => {
        set((state) => ({
          loading: { ...state.loading, fetchingQueue: true },
        }));
        try {
          // TODO: Implement actual API call when endpoint is ready
          // const queue = await CuratorProjectService.getPendingReviewQueue();
          const queue = { reviews: [] }; // Placeholder
          set({ pendingQueue: queue });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener cola de revisión");
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingQueue: false },
          }));
        }
      },

      setSelectedReview: (review: any | null) => {
        set({ selectedReview: review });
      },

      getReviewHistory: async (_filters?: any) => {
        set((state) => ({
          loading: { ...state.loading, fetchingHistory: true },
        }));
        try {
          // TODO: Implement actual API call when endpoint is ready
          // const history = await CuratorProjectService.getReviewHistory(filters);
          const history: any = {
            page: { content: [], totalElements: 0, totalPages: 0 },
            statistics: { total: 0, metrics: {} },
          }; // Placeholder
          set({ reviewHistory: history });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener historial");
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingHistory: false },
          }));
        }
      },

      setSelectedProject: (project: ProjectDto | null) => {
        set({ selectedProject: project });
      },
    }),
    "CuratorProjectStore"
  )
);
