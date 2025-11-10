import AuditService from "@/service/AuditService";
import type { PagedResponse, Statistics } from "@/shared/interface/PaginatedResponse";
import type { ActionDto, ActionResult, EntityType } from "@/shared/types/auditTypes";
import type { LoadingAuditState } from "@/shared/types/loadingTypes";
import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type AuditContextType = {
  actions: ActionDto[];
  selectedAction: ActionDto | null;
  loading: LoadingAuditState;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  statistics: Statistics<ActionDto> | null;

  getAllActions: (filters?: {
    page?: number;
    size?: number;
  }) => Promise<void>;

  getActionsByUser: (
    userId: number,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => Promise<void>;


  getActionsByEntity: (
    entityType: EntityType,
    entityId: number,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => Promise<void>;

  getActionsByType: (
    actionType: string,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => Promise<void>;

  getActionsByResult: (
    result: ActionResult,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => Promise<void>;

  getActionsByDateRange: (
    startDate: string,
    endDate: string,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => Promise<void>;
  setSelectedAction: (action: ActionDto | null) => void;

};

export const AuditContext = createContext<AuditContextType | null>(null);

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<ActionDto[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionDto | null>(null);
  const [statistics, setStatistics] = useState<Statistics<ActionDto> | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState<LoadingAuditState>({
    fetching: false,
    fetchingStatistics: false,
  });

  const updateLoadingState = (key: keyof LoadingAuditState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const handlePagedResponse = (pagedData: PagedResponse<ActionDto>) => {
    setActions(pagedData.page.content);
    setPagination({
      currentPage: pagedData.page.number,
      totalPages: pagedData.page.totalPages,
      totalElements: pagedData.page.totalElements,
      pageSize: pagedData.page.size,
    });
    setStatistics(pagedData.statistics);
  };

  const getAllActions = async (filters?: {
    page?: number;
    size?: number;
  }) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getAllActions(filters);
      handlePagedResponse(data);
    } catch (err: any) {
      toast.error(err.message || "Error al obtener acciones", {
        action: {
          label: "Reintentar",
          onClick: () => getAllActions(filters),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
  };

  const getActionsByUser = async (
    userId: number,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getActionsByUser(userId, filters);
      handlePagedResponse(data);
    } catch (err: any) {
      toast.error(err.message || "Error al obtener acciones del usuario", {
        action: {
          label: "Reintentar",
          onClick: () => getActionsByUser(userId, filters),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
  };


  const getActionsByEntity = async (
    entityType: EntityType,
    entityId: number,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getActionsByEntity(
        entityType,
        entityId,
        filters
      );
      handlePagedResponse(data);
    } catch (err: any) {
      toast.error(err.message || "Error al obtener historial de la entidad", {
        action: {
          label: "Reintentar",
          onClick: () => getActionsByEntity(entityType, entityId, filters),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
  };

  const getActionsByType = async (
    actionType: string,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getActionsByType(actionType, filters);
      handlePagedResponse(data);
    } catch (err: any) {
      toast.error(err.message || "Error al filtrar acciones por tipo", {
        action: {
          label: "Reintentar",
          onClick: () => getActionsByType(actionType, filters),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
  };

  const getActionsByResult = async (
    result: ActionResult,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getActionsByResult(result, filters);
      handlePagedResponse(data);
    } catch (err: any) {
      toast.error(err.message || "Error al filtrar acciones por resultado", {
        action: {
          label: "Reintentar",
          onClick: () => getActionsByResult(result, filters),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
  };

  const getActionsByDateRange = async (
    startDate: string,
    endDate: string,
    filters?: {
      page?: number;
      size?: number;
    }
  ) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getActionsByDateRange(
        startDate,
        endDate,
        filters
      );
      handlePagedResponse(data);
    } catch (err: any) {
      toast.error(err.message || "Error al filtrar acciones por fecha", {
        action: {
          label: "Reintentar",
          onClick: () => getActionsByDateRange(startDate, endDate, filters),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
  };
  return (
    <AuditContext.Provider
      value={{
        actions,
        selectedAction,
        loading,
        pagination,
        statistics,
        getAllActions,
        getActionsByUser,
        getActionsByEntity,
        getActionsByType,
        getActionsByResult,
        getActionsByDateRange,
        setSelectedAction,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};