import { create } from "zustand";
import { logger } from "../middleware/logger";
import AdminProjectService from "@/service/admin/AdminProjectService";
import type { ProjectSearchFilters } from "@/service/admin/AdminProjectService";
import type {
  PaginatedResponse,
  Statistics,
} from "@/shared/interface/PaginatedResponse";
import type { ProjectDto } from "@/shared/types/projectTypes";
import { toast } from "sonner";

interface LoadingState {
  fetching: boolean;
  assigningCurator: boolean;
  deleting: boolean;
  fetchingStats: boolean;
}

interface AdminProjectsState {
  projects: PaginatedResponse<ProjectDto> | null;
  selectedProject: ProjectDto | null;
  stats: Statistics<ProjectDto> | null;
  loading: LoadingState;

  // Actions
  searchProjects: (filters: ProjectSearchFilters) => Promise<void>;
  assignCurator: (projectId: number, curatorId: number) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  fetchProjectStatistics: (month?: number, year?: number) => Promise<void>;
  setSelectedProject: (project: ProjectDto | null) => void;
}

const initialLoadingState: LoadingState = {
  fetching: false,
  assigningCurator: false,
  deleting: false,
  fetchingStats: false,
};

export const useAdminProjectsStore = create<AdminProjectsState>()(
  logger(
    (set, get) => ({
      projects: null,
      selectedProject: null,
      stats: null,
      loading: initialLoadingState,

      searchProjects: async (filters: ProjectSearchFilters) => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const projects = await AdminProjectService.searchProjects(filters);
          set({ projects });
        } catch (error: any) {
          toast.error(error.message || "Error al buscar proyectos");
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      assignCurator: async (projectId: number, curatorId: number) => {
        set((state) => ({
          loading: { ...state.loading, assigningCurator: true },
        }));
        try {
          const updatedProject = await AdminProjectService.assignCurator(
            projectId,
            curatorId
          );

          if (get().selectedProject?.id === projectId) {
            set({ selectedProject: updatedProject });
          }

          toast.success("Curador asignado exitosamente");
        } catch (error: any) {
          toast.error(error.message || "Error al asignar curador");
          throw error;
        } finally {
          set((state) => ({
            loading: { ...state.loading, assigningCurator: false },
          }));
        }
      },

      deleteProject: async (id: number) => {
        set((state) => ({ loading: { ...state.loading, deleting: true } }));
        try {
          await AdminProjectService.deleteProject(id);
          toast.success("Proyecto eliminado exitosamente");
        } catch (error: any) {
          toast.error(error.message || "Error al eliminar proyecto");
        } finally {
          set((state) => ({ loading: { ...state.loading, deleting: false } }));
        }
      },

      fetchProjectStatistics: async (month?: number, year?: number) => {
        set((state) => ({
          loading: { ...state.loading, fetchingStats: true },
        }));
        try {
          const stats = await AdminProjectService.getProjectStatistics(
            month,
            year
          );
          set({ stats });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener estadísticas");
        } finally {
          set((state) => ({
            loading: { ...state.loading, fetchingStats: false },
          }));
        }
      },

      setSelectedProject: (project: ProjectDto | null) => {
        set({ selectedProject: project });
      },
    }),
    "AdminProjectsStore"
  )
);
