import ProjectService from "@/service/ProjectService";
import type {
  LoadingProjectState,
  ProjectDto,
  ProjectReadyDto,
  ProjectSaveDto,
  ProjectVotingDto,
} from "@/shared/types/projectTypes";
import { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type ProjectContextType = {
  selectedProject: ProjectDto | null;
  readyProjects: ProjectReadyDto[];
  votingProjects: ProjectVotingDto[];
  loading: LoadingProjectState;
  getProjectById: (id: number) => Promise<ProjectDto | null>;
  // createProject: (projectData: ProjectSaveDto) => Promise<ProjectDto | null>;
  updateProject: (
    id: number,
    projectData: ProjectSaveDto
  ) => Promise<ProjectDto | null>;
  // deleteProject: (id: number) => Promise<boolean>;

  getReadyToPublish: () => Promise<ProjectDto[]>;
  fetchReadyToPublishNotOpen: () => Promise<void>;
  fetchOpenForVoting: () => Promise<void>;

  submitProject: (projectId: number) => Promise<ProjectDto | null>;
  voteOnProject: (projectId: number, decision: boolean) => Promise<boolean>;

  setSelectedProject: (project: ProjectDto | null) => void;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [readyProjects, setReadyProjects] = useState<ProjectReadyDto[]>([]);
  const [votingProjects, setVotingProjects] = useState<ProjectVotingDto[]>([]);
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
    voting: false,
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

  const getReadyToPublish = useCallback(async (): Promise<ProjectDto[]> => {
    try {
      return await ProjectService.getReadyToPublishProjects();
    } catch (error: any) {
      handleError(error, "Error al obtener proyectos listos para publicar");
      return [];
    }
  }, [handleError]);

  const fetchReadyToPublishNotOpen = useCallback(async (): Promise<void> => {
    updateLoadingState("fetching", true);
    try {
      const projects = await ProjectService.getReadyToPublishNotOpen();
      setReadyProjects(projects);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener proyectos listos no abiertos a votación"
      );
    } finally {
      updateLoadingState("fetching", false);
    }
  }, [handleError, updateLoadingState]);

  const fetchOpenForVoting = useCallback(async (): Promise<void> => {
    updateLoadingState("fetching", true);
    try {
      const projects = await ProjectService.getOpenForVoting();
      setVotingProjects(projects);
    } catch (error: any) {
      handleError(error, "Error al obtener proyectos abiertos a votación");
    } finally {
      updateLoadingState("fetching", false);
    }
  }, [handleError, updateLoadingState]);

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

  const voteOnProject = useCallback(
    async (projectId: number, decision: boolean): Promise<boolean> => {
      updateLoadingState("voting", true);

      try {
        await ProjectService.voteOnProject(projectId, decision);
        toast.success(
          decision
            ? "Voto a favor registrado exitosamente"
            : "Voto en contra registrado exitosamente"
        );
        await fetchOpenForVoting();

        return true;
      } catch (error: any) {
        handleError(error, "Error al registrar voto");
        return false;
      } finally {
        updateLoadingState("voting", false);
      }
    },
    [handleError, updateLoadingState, fetchOpenForVoting]
  );

  return (
    <ProjectContext.Provider
      value={{
        readyProjects,
        votingProjects,
        selectedProject,
        loading,
        getProjectById,
        updateProject,
        getReadyToPublish,
        fetchReadyToPublishNotOpen,
        fetchOpenForVoting,
        submitProject,
        voteOnProject,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
