import VotingService from "@/service/VotingService";
import type {
  LoadingVotingState,
  VotingProjectDto,
  VotingStats,
  CitizenVotingStats,
} from "@/shared/types/votingTypes";
import { createContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type VotingContextType = {
  projects: VotingProjectDto[];
  stats: VotingStats | null;
  selectedProject: VotingProjectDto | null;
  loading: LoadingVotingState;

  // Citizen-specific state
  votingHistory: VotingProjectDto[];
  votingResults: VotingProjectDto[];
  citizenStats: CitizenVotingStats | null;

  fetchVotingProjects: () => Promise<void>;
  fetchVotingStatistics: () => Promise<void>;
  fetchOpenVotingProjects: () => Promise<void>;
  fetchClosedVotingProjects: () => Promise<void>;

  // Citizen-specific methods
  fetchVotingHistory: () => Promise<void>;
  fetchClosedVotingResults: () => Promise<void>;
  fetchCitizenVotingStats: () => Promise<void>;

  setSelectedProject: (project: VotingProjectDto | null) => void;
};

export const VotingContext = createContext<VotingContextType | null>(null);

export const VotingProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<VotingProjectDto[]>([]);
  const [stats, setStats] = useState<VotingStats | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<VotingProjectDto | null>(null);

  // Citizen-specific state
  const [votingHistory, setVotingHistory] = useState<VotingProjectDto[]>([]);
  const [votingResults, setVotingResults] = useState<VotingProjectDto[]>([]);
  const [citizenStats, setCitizenStats] = useState<CitizenVotingStats | null>(
    null
  );

  const [loading, setLoading] = useState<LoadingVotingState>({
    fetching: false,
    fetchingStats: false,
    fetchingHistory: false,
    fetchingResults: false,
    fetchingCitizenStats: false,
  });

  const updateLoadingState = useCallback(
    (key: keyof LoadingVotingState, value: boolean) => {
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

  const fetchVotingProjects = useCallback(async (): Promise<void> => {
    updateLoadingState("fetching", true);
    try {
      const votingProjects = await VotingService.getVotingProjects();
      setProjects(votingProjects);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener proyectos en votación",
        fetchVotingProjects
      );
    } finally {
      updateLoadingState("fetching", false);
    }
  }, [handleError, updateLoadingState]);

  const fetchVotingStatistics = useCallback(async (): Promise<void> => {
    updateLoadingState("fetchingStats", true);
    try {
      const statistics = await VotingService.getVotingStatistics();
      setStats(statistics);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener estadísticas de votación",
        fetchVotingStatistics
      );
    } finally {
      updateLoadingState("fetchingStats", false);
    }
  }, [handleError, updateLoadingState]);

  const fetchOpenVotingProjects = useCallback(async (): Promise<void> => {
    updateLoadingState("fetching", true);
    try {
      const openProjects = await VotingService.getOpenVotingProjects();
      setProjects(openProjects);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener votaciones abiertas",
        fetchOpenVotingProjects
      );
    } finally {
      updateLoadingState("fetching", false);
    }
  }, [handleError, updateLoadingState]);

  const fetchClosedVotingProjects = useCallback(async (): Promise<void> => {
    updateLoadingState("fetching", true);
    try {
      const closedProjects = await VotingService.getClosedVotingProjects();
      setProjects(closedProjects);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener votaciones cerradas",
        fetchClosedVotingProjects
      );
    } finally {
      updateLoadingState("fetching", false);
    }
  }, [handleError, updateLoadingState]);

  const fetchVotingHistory = useCallback(async (): Promise<void> => {
    updateLoadingState("fetchingHistory", true);
    try {
      const history = await VotingService.getVotingHistory();
      setVotingHistory(history);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener historial de votaciones",
        fetchVotingHistory
      );
    } finally {
      updateLoadingState("fetchingHistory", false);
    }
  }, [handleError, updateLoadingState]);

  const fetchClosedVotingResults = useCallback(async (): Promise<void> => {
    updateLoadingState("fetchingResults", true);
    try {
      const results = await VotingService.getClosedVotingResults();
      setVotingResults(results);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener resultados de votaciones",
        fetchClosedVotingResults
      );
    } finally {
      updateLoadingState("fetchingResults", false);
    }
  }, [handleError, updateLoadingState]);

  const fetchCitizenVotingStats = useCallback(async (): Promise<void> => {
    updateLoadingState("fetchingCitizenStats", true);
    try {
      const stats = await VotingService.getCitizenVotingStats();
      setCitizenStats(stats);
    } catch (error: any) {
      handleError(
        error,
        "Error al obtener estadísticas de votación",
        fetchCitizenVotingStats
      );
    } finally {
      updateLoadingState("fetchingCitizenStats", false);
    }
  }, [handleError, updateLoadingState]);

  const resetVotingState = useCallback(() => {
    setProjects([]);
    setStats(null);
    setSelectedProject(null);
    setVotingHistory([]);
    setVotingResults([]);
    setCitizenStats(null);
    setLoading({
      fetching: false,
      fetchingStats: false,
      fetchingHistory: false,
      fetchingResults: false,
      fetchingCitizenStats: false,
    });
  }, []);

  useEffect(() => {
    const handleUserLoggedIn = async () => {
      await Promise.all([fetchVotingProjects(), fetchVotingStatistics()]);
    };

    const handleUserLoggedOut = () => {
      resetVotingState();
    };

    const user = localStorage.getItem("user");
    if (user) {
      handleUserLoggedIn();
    }

    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    window.addEventListener("userLoggedOut", handleUserLoggedOut);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("userLoggedOut", handleUserLoggedOut);
    };
  }, [fetchVotingProjects, fetchVotingStatistics, resetVotingState]);

  return (
    <VotingContext.Provider
      value={{
        projects,
        stats,
        selectedProject,
        loading,
        votingHistory,
        votingResults,
        citizenStats,
        fetchVotingProjects,
        fetchVotingStatistics,
        fetchOpenVotingProjects,
        fetchClosedVotingProjects,
        fetchVotingHistory,
        fetchClosedVotingResults,
        fetchCitizenVotingStats,
        setSelectedProject,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
