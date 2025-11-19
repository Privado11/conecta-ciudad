import ProjectService from "@/service/ProjectService";
import type {
  LoadingProjectState,
  ProjectDto,
  ProjectSaveDto,
} from "@/shared/types/projectTypes";
import { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type ProjectContextType = {
  selectedProject: ProjectDto | null;
  loading: LoadingProjectState;
  getProjectById: (id: number) => Promise<ProjectDto | null>;
  // createProject: (projectData: ProjectSaveDto) => Promise<ProjectDto | null>;
  updateProject: (
    id: number,
    projectData: ProjectSaveDto
  ) => Promise<ProjectDto | null>;
  // deleteProject: (id: number) => Promise<boolean>;

  addObservations: (
    projectId: number,
    notes: string
  ) => Promise<ProjectDto | null>;
  approveProject: (
    projectId: number,
    data: { votingStartAt: string; votingEndAt: string }
  ) => Promise<ProjectDto | null>;
  getMyCuratedProjects: (status?: string) => Promise<ProjectDto[]>;
  getReadyToPublish: () => Promise<ProjectDto[]>;
  submitProject: (projectId: number) => Promise<ProjectDto | null>;

  setSelectedProject: (project: ProjectDto | null) => void;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(
    null
  );

  const [loading, setLoading] = useState<LoadingProjectState>({
    fetching: false,
    creating: false,
    updating: false,
    deleting: false,
    fetchingDetails: false,
    assigningCurator: false,
  });

  const updateLoadingState = useCallback(
    (key: keyof LoadingProjectState, value: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: value }));
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

  // const createProject = useCallback(
  //   async (projectData: ProjectSaveDto): Promise<ProjectDto | null> => {
  //     updateLoadingState("creating", true);

  //     try {
  //       const newProject = await ProjectService.createProject(projectData);
  //       toast.success("Proyecto creado exitosamente");

  //       if (lastFilters) {
  //         await refreshCurrentSearch();
  //       }

  //       return newProject;
  //     } catch (error: any) {
  //       handleError(error, "Error al crear proyecto");
  //       return null;
  //     } finally {
  //       updateLoadingState("creating", false);
  //     }
  //   },
  //   [updateLoadingState, handleError, lastFilters, refreshCurrentSearch]
  // );

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

        // setProjects((prev) =>
        //   prev.map((p) => (p.id === id ? updatedProject : p))
        // );

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

  // const deleteProject = useCallback(
  //   async (id: number): Promise<boolean> => {
  //     updateLoadingState("deleting", true);

  //     try {
  //       await ProjectService.deleteProject(id);
  //       toast.success("Proyecto eliminado exitosamente");

  //       setProjects((prev) => prev.filter((p) => p.id !== id));

  //       if (selectedProject?.id === id) {
  //         setSelectedProject(null);
  //       }

  //       return true;
  //     } catch (error: any) {
  //       handleError(error, "Error al eliminar proyecto");
  //       return false;
  //     } finally {
  //       updateLoadingState("deleting", false);
  //     }
  //   },
  //   [updateLoadingState, handleError, selectedProject]
  // );

  const addObservations = useCallback(
    async (projectId: number, notes: string): Promise<ProjectDto | null> => {
      updateLoadingState("updating", true);

      try {
        const updatedProject = await ProjectService.addObservations(
          projectId,
          notes
        );
        toast.success("Observaciones agregadas exitosamente");

        // setProjects((prev) =>
        //   prev.map((p) => (p.id === projectId ? updatedProject : p))
        // );

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

        // setProjects((prev) =>
        //   prev.map((p) => (p.id === projectId ? updatedProject : p))
        // );

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
        selectedProject,
        loading,

        getProjectById,

        updateProject,

        addObservations,
        approveProject,

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
