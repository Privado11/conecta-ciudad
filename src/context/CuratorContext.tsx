import CuratorService from "@/service/CuratorService";
import type { ProjectDto, ProjectStatus } from "@/shared/types/projectTypes";
import type {
  LoadingCuratorState,
  PagedResponse,
  PendingReviewDto,
  PendingReviewQueueDto,
  ReviewHistoryDto,
  ReviewHistoryFilters,
} from "@/shared/types/curatorTypes";
import { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type CuratorContextType = {
  pendingQueue: PendingReviewQueueDto | null;
  selectedReview: PendingReviewDto | null;
  curatedProjects: ProjectDto[];
  reviewHistory: PagedResponse<ReviewHistoryDto> | null;
  loading: LoadingCuratorState;

  getPendingReviewQueue: () => Promise<PendingReviewQueueDto | null>;
  getPendingReviewDetails: (projectId: number) => Promise<PendingReviewDto | null>;
  getMyCuratedProjects: (status?: ProjectStatus) => Promise<ProjectDto[]>;
  getReviewHistory: (
    filters?: ReviewHistoryFilters
  ) => Promise<PagedResponse<ReviewHistoryDto> | null>;
  
  addObservations: (projectId: number, notes: string) => Promise<ProjectDto | null>;
  approveProject: (
    projectId: number,
    data: { votingStartAt: string; votingEndAt: string }
  ) => Promise<ProjectDto | null>;

  setSelectedReview: (review: PendingReviewDto | null) => void;
  clearPendingQueue: () => void;
  clearReviewHistory: () => void;
};

export const CuratorContext = createContext<CuratorContextType | null>(null);

export const CuratorProvider = ({ children }: { children: ReactNode }) => {
  const [pendingQueue, setPendingQueue] = useState<PendingReviewQueueDto | null>(null);
  const [selectedReview, setSelectedReview] = useState<PendingReviewDto | null>(null);
  const [curatedProjects, setCuratedProjects] = useState<ProjectDto[]>([]);
  const [reviewHistory, setReviewHistory] =
    useState<PagedResponse<ReviewHistoryDto> | null>(null);

  const [loading, setLoading] = useState<LoadingCuratorState>({
    fetchingQueue: false,
    fetchingDetails: false,
    fetchingProjects: false,
    fetchingHistory: false,
    addingObservations: false,
    approvingProject: false,
  });

  const updateLoadingState = useCallback(
    (key: keyof LoadingCuratorState, value: boolean) => {
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

  const getPendingReviewQueue = useCallback(async (): Promise<PendingReviewQueueDto | null> => {
    updateLoadingState("fetchingQueue", true);

    try {
      const queue = await CuratorService.getPendingReviewQueue();
      setPendingQueue(queue);
      return queue;
    } catch (error: any) {
      handleError(error, "Error al obtener cola de revisiones");
      return null;
    } finally {
      updateLoadingState("fetchingQueue", false);
    }
  }, [updateLoadingState, handleError]);

  const getPendingReviewDetails = useCallback(
    async (projectId: number): Promise<PendingReviewDto | null> => {
      updateLoadingState("fetchingDetails", true);

      try {
        const review = await CuratorService.getPendingReviewDetails(projectId);
        setSelectedReview(review);
        return review;
      } catch (error: any) {
        handleError(error, "Error al obtener detalles de la revisión");
        return null;
      } finally {
        updateLoadingState("fetchingDetails", false);
      }
    },
    [updateLoadingState, handleError]
  );

  const getMyCuratedProjects = useCallback(
    async (status?: ProjectStatus): Promise<ProjectDto[]> => {
      updateLoadingState("fetchingProjects", true);

      try {
        const projects = await CuratorService.getMyCuratedProjects(status);
        setCuratedProjects(projects);
        return projects;
      } catch (error: any) {
        handleError(error, "Error al obtener proyectos curados");
        return [];
      } finally {
        updateLoadingState("fetchingProjects", false);
      }
    },
    [updateLoadingState, handleError]
  );

  const getReviewHistory = useCallback(
    async (
      filters?: ReviewHistoryFilters
    ): Promise<PagedResponse<ReviewHistoryDto> | null> => {
      updateLoadingState("fetchingHistory", true);

      try {
        const history = await CuratorService.getReviewHistory(filters);
        setReviewHistory(history);
        return history;
      } catch (error: any) {
        handleError(error, "Error al obtener historial de revisiones");
        return null;
      } finally {
        updateLoadingState("fetchingHistory", false);
      }
    },
    [updateLoadingState, handleError]
  );


  const addObservations = useCallback(
    async (projectId: number, notes: string): Promise<ProjectDto | null> => {
      updateLoadingState("addingObservations", true);

      try {
        const updatedProject = await CuratorService.addObservations(projectId, notes);
        toast.success("Observaciones agregadas exitosamente");

        if (pendingQueue) {
          setPendingQueue({
            ...pendingQueue,
            reviews: pendingQueue.reviews.filter(r => r.projectId !== projectId),
            statistics: {
              ...pendingQueue.statistics,
              total: pendingQueue.statistics.total - 1,
            }
          });
        }

        if (selectedReview?.projectId === projectId) {
          setSelectedReview(null);
        }

        return updatedProject;
      } catch (error: any) {
        handleError(error, "Error al agregar observaciones");
        return null;
      } finally {
        updateLoadingState("addingObservations", false);
      }
    },
    [updateLoadingState, handleError, pendingQueue, selectedReview]
  );

  const approveProject = useCallback(
    async (
      projectId: number,
      data: { votingStartAt: string; votingEndAt: string }
    ): Promise<ProjectDto | null> => {
      updateLoadingState("approvingProject", true);

      try {
        const updatedProject = await CuratorService.approveProject(projectId, data);
        toast.success("Proyecto aprobado exitosamente");

        if (pendingQueue) {
          setPendingQueue({
            ...pendingQueue,
            reviews: pendingQueue.reviews.filter(r => r.projectId !== projectId),
            statistics: {
              ...pendingQueue.statistics,
              total: pendingQueue.statistics.total - 1,
            }
          });
        }

        if (selectedReview?.projectId === projectId) {
          setSelectedReview(null);
        }

        return updatedProject;
      } catch (error: any) {
        handleError(error, "Error al aprobar proyecto");
        return null;
      } finally {
        updateLoadingState("approvingProject", false);
      }
    },
    [updateLoadingState, handleError, pendingQueue, selectedReview]
  );

  const clearPendingQueue = useCallback(() => {
    setPendingQueue(null);
    setSelectedReview(null);
  }, []);

  const clearReviewHistory = useCallback(() => {
    setReviewHistory(null);
  }, []);

  return (
    <CuratorContext.Provider
      value={{
        pendingQueue,
        selectedReview,
        curatedProjects,
        reviewHistory,
        loading,

        getPendingReviewQueue,
        getPendingReviewDetails,
        getMyCuratedProjects,
        getReviewHistory,
        
        addObservations,
        approveProject,

        setSelectedReview,
        clearPendingQueue,
        clearReviewHistory,
      }}
    >
      {children}
    </CuratorContext.Provider>
  );
};