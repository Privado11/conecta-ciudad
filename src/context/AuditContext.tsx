import AuditService, { type SearchFilters } from "@/service/AuditService";
import type {
  PagedResponse,
  Statistics,
} from "@/shared/interface/PaginatedResponse";
import type { ActionDetails, ActionDto } from "@/shared/types/auditTypes";
import type { LoadingAuditState } from "@/shared/types/loadingTypes";
import { createContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type AuditContextType = {
  actions: ActionDto[];
  selectedAction: ActionDto | null;
  actionDetails: ActionDetails | null;
  loading: LoadingAuditState;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  statistics: Statistics<ActionDto> | null;

  searchActions: (filters: SearchFilters) => Promise<void>;
  getActionDetails: (id: number) => Promise<void>;
  setSelectedAction: (action: ActionDto | null) => void;
  clearActions: () => void;

  refreshCurrentSearch: () => Promise<void>;
  hasActiveFilters: boolean;
};

export const AuditContext = createContext<AuditContextType | null>(null);

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<ActionDto[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionDto | null>(null);
  const [actionDetails, setActionDetails] = useState<ActionDetails | null>(
    null
  );
  const [statistics, setStatistics] = useState<Statistics<ActionDto> | null>(
    null
  );
  const [lastFilters, setLastFilters] = useState<SearchFilters | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
  });

  const [loading, setLoading] = useState<LoadingAuditState>({
    fetching: false,
    fetchingStatistics: false,
    fetchingDetails: false,
  });

  const hasActiveFilters = useMemo(() => {
    if (!lastFilters) return false;
    return !!(
      lastFilters.actionType ||
      lastFilters.result ||
      lastFilters.entityType ||
      lastFilters.searchTerm ||
      lastFilters.startDate ||
      lastFilters.endDate
    );
  }, [lastFilters]);

  const updateLoadingState = useCallback(
    (key: keyof LoadingAuditState, value: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handlePagedResponse = useCallback(
    (pagedData: PagedResponse<ActionDto>) => {
      setActions(pagedData.page.content);
      setPagination({
        currentPage: pagedData.page.number,
        totalPages: pagedData.page.totalPages,
        totalElements: pagedData.page.totalElements,
        pageSize: pagedData.page.size,
      });
      setStatistics(pagedData.statistics);
    },
    []
  );

  const handleError = useCallback(
    (error: any, defaultMessage: string, retryAction: () => void) => {
      const errorMessage =
        error.response?.data?.message || error.message || defaultMessage;
      toast.error(errorMessage, {
        action: {
          label: "Reintentar",
          onClick: retryAction,
        },
      });
    },
    []
  );

  const searchActions = useCallback(
    async (filters: SearchFilters) => {
      updateLoadingState("fetching", true);
      setLastFilters(filters);

      try {
        const data = await AuditService.searchActions(filters);
        handlePagedResponse(data);
      } catch (err: any) {
        handleError(err, "Error al buscar acciones", () =>
          searchActions(filters)
        );
      } finally {
        updateLoadingState("fetching", false);
      }
    },
    [updateLoadingState, handlePagedResponse, handleError]
  );

  const refreshCurrentSearch = useCallback(async () => {
    if (lastFilters) {
      await searchActions(lastFilters);
    }
  }, [lastFilters, searchActions]);

  const clearActions = useCallback(() => {
    setActions([]);
    setSelectedAction(null);
    setStatistics(null);
    setLastFilters(null);
    setPagination({
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 20,
    });
  }, []);

  const getActionDetails = useCallback(
    async (id: number) => {
      setActionDetails((prev) => {
        if (prev && prev.id === id) {
          return prev;
        }
        return null;
      });

      if (actionDetails && actionDetails.id === id) {
        return;
      }

      updateLoadingState("fetchingDetails", true);

      try {
        const details = await AuditService.getActionDetails(id);
        setActionDetails(details);
      } catch (error: any) {
        handleError(error, "Error al obtener detalles", () =>
          getActionDetails(id)
        );
        setActionDetails(null);
      } finally {
        updateLoadingState("fetchingDetails", false);
      }
    },
    [actionDetails, updateLoadingState, handleError]
  );

  return (
    <AuditContext.Provider
      value={{
        actions,
        selectedAction,
        actionDetails,
        loading,
        pagination,
        statistics,
        searchActions,
        getActionDetails,
        setSelectedAction,
        clearActions,
        refreshCurrentSearch,
        hasActiveFilters,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
