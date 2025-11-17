import ProjectService, {
  type ProjectSearchFilters,
} from "@/service/ProjectService";
import type {
  PaginatedResponse,
  Statistics,
} from "@/shared/interface/PaginatedResponse";
import type {
  LoadingProjectState,
  ProjectDto,
  ProjectSaveDto,
} from "@/shared/types/projectTypes";
import { createContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type ProjectContextType = {
  projects: ProjectDto[];
  selectedProject: ProjectDto | null;
  loading: LoadingProjectState;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  statistics: Statistics<ProjectDto> | null;

  searchProjects: (filters: ProjectSearchFilters) => Promise<void>;
  refreshCurrentSearch: () => Promise<void>;
  clearProjects: () => void;
  hasActiveFilters: boolean;

  getProjectById: (id: number) => Promise<ProjectDto | null>;
  createProject: (projectData: ProjectSaveDto) => Promise<ProjectDto | null>;
  updateProject: (
    id: number,
    projectData: ProjectSaveDto
  ) => Promise<ProjectDto | null>;
  deleteProject: (id: number) => Promise<boolean>;

  assignCurator: (
    projectId: number,
    curatorId: number
  ) => Promise<ProjectDto | null>;
  addObservations: (
    projectId: number,
    notes: string
  ) => Promise<ProjectDto | null>;
  approveProject: (
    projectId: number,
    data: { votingStartAt: string; votingEndAt: string }
  ) => Promise<ProjectDto | null>;
  getStatistics: (month?: number, year?: number) => Promise<void>;
  getMyCuratedProjects: (status?: string) => Promise<ProjectDto[]>;
  getReadyToPublish: () => Promise<ProjectDto[]>;
  submitProject: (projectId: number) => Promise<ProjectDto | null>;

  setSelectedProject: (project: ProjectDto | null) => void;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(
    null
  );
  const [statistics, setStatistics] = useState<Statistics<ProjectDto> | null>(
    null
  );
  const [lastFilters, setLastFilters] = useState<ProjectSearchFilters | null>(
    null
  );

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
  });

  const [loading, setLoading] = useState<LoadingProjectState>({
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
      setLoading((prev) => ({ ...prev, [key]: value }));
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
        const data = await ProjectService.searchProjects(filters);
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
    setStatistics(null);
    setLastFilters(null);
    setPagination({
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 20,
    });
  }, []);

  const getProjectById = useCallback(
    async (id: number): Promise<ProjectDto | null> => {
      updateLoadingState("fetchingDetails", true);

      try {
        const project = await ProjectService.getProjectById(id);
        setSelectedProject(project);
        return project;
      } catch (error: any) {
        handleError(error, "Error al obtener proyecto");
        return null;
      } finally {
        updateLoadingState("fetchingDetails", false);
      }
    },
    [updateLoadingState, handleError]
  );

  const createProject = useCallback(
    async (projectData: ProjectSaveDto): Promise<ProjectDto | null> => {
      updateLoadingState("creating", true);

      try {
        const newProject = await ProjectService.createProject(projectData);
        toast.success("Proyecto creado exitosamente");

        if (lastFilters) {
          await refreshCurrentSearch();
        }

        return newProject;
      } catch (error: any) {
        handleError(error, "Error al crear proyecto");
        return null;
      } finally {
        updateLoadingState("creating", false);
      }
    },
    [updateLoadingState, handleError, lastFilters, refreshCurrentSearch]
  );

  const updateProject = useCallback(
    async (
      id: number,
      projectData: ProjectSaveDto
    ): Promise<ProjectDto | null> => {
      updateLoadingState("updating", true);

      try {
        const updatedProject = await ProjectService.updateProject(
          id,
          projectData
        );
        toast.success("Proyecto actualizado exitosamente");

        setProjects((prev) =>
          prev.map((p) => (p.id === id ? updatedProject : p))
        );

        if (selectedProject?.id === id) {
          setSelectedProject(updatedProject);
        }

        return updatedProject;
      } catch (error: any) {
        handleError(error, "Error al actualizar proyecto");
        return null;
      } finally {
        updateLoadingState("updating", false);
      }
    },
    [updateLoadingState, handleError, selectedProject]
  );

  const deleteProject = useCallback(
    async (id: number): Promise<boolean> => {
      updateLoadingState("deleting", true);

      try {
        await ProjectService.deleteProject(id);
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
        const updatedProject = await ProjectService.assignCurator(
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

  const addObservations = useCallback(
    async (projectId: number, notes: string): Promise<ProjectDto | null> => {
      updateLoadingState("updating", true);

      try {
        const updatedProject = await ProjectService.addObservations(
          projectId,
          notes
        );
        toast.success("Observaciones agregadas exitosamente");

        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updatedProject : p))
        );

        if (selectedProject?.id === projectId) {
          setSelectedProject(updatedProject);
        }

        return updatedProject;
      } catch (error: any) {
        handleError(error, "Error al agregar observaciones");
        return null;
      } finally {
        updateLoadingState("updating", false);
      }
    },
    [updateLoadingState, handleError, selectedProject]
  );

  const approveProject = useCallback(
    async (
      projectId: number,
      data: { votingStartAt: string; votingEndAt: string }
    ): Promise<ProjectDto | null> => {
      updateLoadingState("updating", true);

      try {
        const updatedProject = await ProjectService.approveProject(
          projectId,
          data
        );
        toast.success("Proyecto aprobado exitosamente");

        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updatedProject : p))
        );

        if (selectedProject?.id === projectId) {
          setSelectedProject(updatedProject);
        }

        return updatedProject;
      } catch (error: any) {
        handleError(error, "Error al aprobar proyecto");
        return null;
      } finally {
        updateLoadingState("updating", false);
      }
    },
    [updateLoadingState, handleError, selectedProject]
  );

  const getStatistics = useCallback(
    async (month?: number, year?: number) => {
      updateLoadingState("fetching", true);
      try {
        const stats = await ProjectService.getProjectStatistics(month, year);
        setStatistics(stats);
      } catch (error: any) {
        handleError(error, "Error al obtener estadísticas");
      } finally {
        updateLoadingState("fetching", false);
      }
    },
    [handleError, updateLoadingState]
  );

  const getMyCuratedProjects = useCallback(
    async (status?: string): Promise<ProjectDto[]> => {
      try {
        return await ProjectService.getMyCuratedProjects(status as any);
      } catch (error: any) {
        handleError(error, "Error al obtener proyectos curatorados");
        return [];
      }
    },
    [handleError]
  );

  const getReadyToPublish = useCallback(async (): Promise<ProjectDto[]> => {
    try {
      return await ProjectService.getReadyToPublishProjects();
    } catch (error: any) {
      handleError(error, "Error al obtener proyectos listos para publicar");
      return [];
    }
  }, [handleError]);

  const submitProject = useCallback(
    async (projectId: number): Promise<ProjectDto | null> => {
      updateLoadingState("updating", true);

      try {
        const updatedProject = await ProjectService.submitProject(projectId);
        toast.success("Proyecto enviado correctamente");

        return updatedProject;
      } catch (error: any) {
        handleError(error, "Error al enviar proyecto");
        return null;
      } finally {
        updateLoadingState("updating", false);
      }
    },
    [handleError, updateLoadingState]
  );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        loading,
        pagination,
        statistics,
        searchProjects,
        refreshCurrentSearch,
        clearProjects,
        hasActiveFilters,
        getProjectById,
        createProject,
        updateProject,
        deleteProject,
        assignCurator,
        addObservations,
        approveProject,
        getStatistics,
        getMyCuratedProjects,
        getReadyToPublish,
        submitProject,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};


