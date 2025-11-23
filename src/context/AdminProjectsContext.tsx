import type { ProjectSearchFilters } from "@/service/AdminService";
import AdminService from "@/service/AdminService";
import type {
  PaginatedResponse,
  Statistics,
} from "@/shared/interface/PaginatedResponse";
import type {
  LoadingProjectState,
  ProjectDto,
} from "@/shared/types/projectTypes";
import { createContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type AdminProjectsContextType = {
  projects: ProjectDto[];
  selectedProject: ProjectDto | null;
  loadingProjects: LoadingProjectState;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  statisticsProjects: Statistics<ProjectDto> | null;

  searchProjects: (filters: ProjectSearchFilters) => Promise<void>;
  refreshCurrentSearch: () => Promise<void>;
  clearProjects: () => void;
  hasActiveFilters: boolean;

  deleteProject: (id: number) => Promise<boolean>;

  assignCurator: (
    projectId: number,
    curatorId: number
  ) => Promise<ProjectDto | null>;

  getStatistics: (month?: number, year?: number) => Promise<void>;

  setSelectedProject: (project: ProjectDto | null) => void;
};

export const AdminProjectsContext =
  createContext<AdminProjectsContextType | null>(null);

export const AdminProjectsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(
    null
  );
  const [statisticsProjects, setStatisticsProjects] =
    useState<Statistics<ProjectDto> | null>(null);
  const [lastFilters, setLastFilters] = useState<ProjectSearchFilters | null>(
    null
  );

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
  });

  const [loadingProjects, setLoadingProjects] = useState<LoadingProjectState>({
    fetching: false,
    creating: false,
    updating: false,
    deleting: false,
    fetchingDetails: false,
    assigningCurator: false,
  });

  const hasActiveFilters = useMemo(() => {
    if (!lastFilters) return false;
    return !!(
      lastFilters.searchTerm ||
      lastFilters.status ||
      lastFilters.creatorId ||
      lastFilters.curatorId ||
      lastFilters.projectStartFrom ||
      lastFilters.projectStartTo ||
      lastFilters.projectEndFrom ||
      lastFilters.projectEndTo ||
      lastFilters.votingStartFrom ||
      lastFilters.votingStartTo ||
      lastFilters.votingEndFrom ||
      lastFilters.votingEndTo ||
      lastFilters.createdFrom ||
      lastFilters.createdTo
    );
  }, [lastFilters]);

  const updateLoadingState = useCallback(
    (key: keyof LoadingProjectState, value: boolean) => {
      setLoadingProjects((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handlePagedResponse = useCallback(
    (pagedData: PaginatedResponse<ProjectDto>) => {
      setProjects(pagedData.content);
      setPagination({
        currentPage: pagedData.number,
        totalPages: pagedData.totalPages,
        totalElements: pagedData.totalElements,
        pageSize: pagedData.size,
      });
    },
    []
  );

  const handleError = useCallback(
    (error: any, defaultMessage: string, retryAction?: () => void) => {
      const errorMessage =
        error.response?.data?.message || error.message || defaultMessage;

      if (retryAction) {
        toast.error(errorMessage, {
          action: {
            label: "Reintentar",
            onClick: retryAction,
          },
        });
      } else {
        toast.error(errorMessage);
      }
    },
    []
  );

  const searchProjects = useCallback(
    async (filters: ProjectSearchFilters) => {
      updateLoadingState("fetching", true);
      setLastFilters(filters);

      try {
        const data = await AdminService.searchProjects(filters);
        handlePagedResponse(data);
      } catch (err: any) {
        handleError(err, "Error al buscar proyectos", () =>
          searchProjects(filters)
        );
      } finally {
        updateLoadingState("fetching", false);
      }
    },
    [updateLoadingState, handlePagedResponse, handleError]
  );

  const refreshCurrentSearch = useCallback(async () => {
    if (lastFilters) {
      await searchProjects(lastFilters);
    }
  }, [lastFilters, searchProjects]);

  const clearProjects = useCallback(() => {
    setProjects([]);
    setSelectedProject(null);
    setStatisticsProjects(null);
    setLastFilters(null);
    setPagination({
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 20,
    });
  }, []);

  const deleteProject = useCallback(
    async (id: number): Promise<boolean> => {
      updateLoadingState("deleting", true);

      try {
        await AdminService.deleteProject(id);
        toast.success("Proyecto eliminado exitosamente");

        setProjects((prev) => prev.filter((p) => p.id !== id));

        if (selectedProject?.id === id) {
          setSelectedProject(null);
        }

        return true;
      } catch (error: any) {
        handleError(error, "Error al eliminar proyecto");
        return false;
      } finally {
        updateLoadingState("deleting", false);
      }
    },
    [updateLoadingState, handleError, selectedProject]
  );

  const assignCurator = useCallback(
    async (
      projectId: number,
      curatorId: number
    ): Promise<ProjectDto | null> => {
      updateLoadingState("assigningCurator", true);

      try {
        const updatedProject = await AdminService.assignCurator(
          projectId,
          curatorId
        );
        toast.success("Curador asignado exitosamente");

        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updatedProject : p))
        );

        if (selectedProject?.id === projectId) {
          setSelectedProject(updatedProject);
        }

        return updatedProject;
      } catch (error: any) {
        handleError(error, "Error al asignar curador");
        return null;
      } finally {
        updateLoadingState("assigningCurator", false);
      }
    },
    [updateLoadingState, handleError, selectedProject]
  );

  const getStatistics = useCallback(
    async (month?: number, year?: number) => {
      updateLoadingState("fetching", true);
      try {
        const stats = await AdminService.getProjectStatistics(month, year);
        setStatisticsProjects(stats);
      } catch (error: any) {
        handleError(error, "Error al obtener estadísticas");
      } finally {
        updateLoadingState("fetching", false);
      }
    },
    [handleError, updateLoadingState]
  );

  return (
    <AdminProjectsContext.Provider
      value={{
        projects,
        selectedProject,
        loadingProjects,
        pagination,
        statisticsProjects,
        searchProjects,
        refreshCurrentSearch,
        clearProjects,
        hasActiveFilters,
        deleteProject,
        assignCurator,
        getStatistics,
        setSelectedProject,
      }}
    >
      {children}
    </AdminProjectsContext.Provider>
  );
};
