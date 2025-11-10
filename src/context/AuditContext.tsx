import AuditService from "@/service/AuditService";
import type { ActionDto, ActionResult, EntityType, PagedAuditResponse } from "@/shared/types/auditTypes";
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
  statistics: {
    byType?: Record<string, number>;
    byResult?: Record<ActionResult, number>;
  };

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

  countActionsByUser: (
    userId: number,
    filters?: {
      startDate?: string;
      endDate?: string;
    }
  ) => Promise<{
    userId: number;
    count: number;
    startDate: string;
    endDate: string;
  } | null>;

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

  getStatisticsByType: (
    startDate: string,
    endDate: string
  ) => Promise<void>;

  getStatisticsByResult: (
    startDate: string,
    endDate: string
  ) => Promise<void>;

  getRecentActivity: (limit?: number) => Promise<void>;

  getRecentActivityByUser: (
    userId: number,
    limit?: number
  ) => Promise<void>;

  setSelectedAction: (action: ActionDto | null) => void;
  clearStatistics: () => void;
};

export const AuditContext = createContext<AuditContextType | null>(null);

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<ActionDto[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionDto | null>(null);
  const [statistics, setStatistics] = useState<{
    byType?: Record<string, number>;
    byResult?: Record<ActionResult, number>;
  }>({});
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

  const handlePagedResponse = (data: PagedAuditResponse) => {
    setActions(data.content);
    setPagination({
      currentPage: data.number,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      pageSize: data.size,
    });
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

  const countActionsByUser = async (
    userId: number,
    filters?: {
      startDate?: string;
      endDate?: string;
    }
  ) => {
    try {
      const data = await AuditService.countActionsByUser(userId, filters);
      return data;
    } catch (err: any) {
      toast.error(err.message || "Error al contar acciones del usuario");
      return null;
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

  const getStatisticsByType = async (
    startDate: string,
    endDate: string
  ) => {
    updateLoadingState("fetchingStatistics", true);
    try {
      const data = await AuditService.getStatisticsByType(startDate, endDate);
      setStatistics((prev) => ({ ...prev, byType: data }));
      toast.success("Estadísticas por tipo obtenidas exitosamente");
    } catch (err: any) {
      toast.error(err.message || "Error al obtener estadísticas por tipo", {
        action: {
          label: "Reintentar",
          onClick: () => getStatisticsByType(startDate, endDate),
        },
      });
    } finally {
      updateLoadingState("fetchingStatistics", false);
    }
  };

  const getStatisticsByResult = async (
    startDate: string,
    endDate: string
  ) => {
    updateLoadingState("fetchingStatistics", true);
    try {
      const data = await AuditService.getStatisticsByResult(startDate, endDate);
      setStatistics((prev) => ({ ...prev, byResult: data }));
      toast.success("Estadísticas por resultado obtenidas exitosamente");
    } catch (err: any) {
      toast.error(err.message || "Error al obtener estadísticas por resultado", {
        action: {
          label: "Reintentar",
          onClick: () => getStatisticsByResult(startDate, endDate),
        },
      });
    } finally {
      updateLoadingState("fetchingStatistics", false);
    }
  };

  const getRecentActivity = async (limit?: number) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getRecentActivity(limit);
      setActions(data.actions);
      setPagination({
        currentPage: 0,
        totalPages: 1,
        totalElements: data.count,
        pageSize: data.count,
      });
    } catch (err: any) {
      toast.error(err.message || "Error al obtener actividad reciente", {
        action: {
          label: "Reintentar",
          onClick: () => getRecentActivity(limit),
        },
      });
    } finally {
      updateLoadingState("fetching", false);
    }
  };

  const getRecentActivityByUser = async (
    userId: number,
    limit?: number
  ) => {
    updateLoadingState("fetching", true);
    try {
      const data = await AuditService.getRecentActivityByUser(userId, limit);
      setActions(data.actions);
      setPagination({
        currentPage: 0,
        totalPages: 1,
        totalElements: data.count,
        pageSize: data.count,
      });
    } catch (err: any) {
      toast.error(
        err.message || "Error al obtener actividad reciente del usuario",
        {
          action: {
            label: "Reintentar",
            onClick: () => getRecentActivityByUser(userId, limit),
          },
        }
      );
    } finally {
      updateLoadingState("fetching", false);
    }
  };

  const clearStatistics = () => {
    setStatistics({});
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
        countActionsByUser,
        getActionsByEntity,
        getActionsByType,
        getActionsByResult,
        getActionsByDateRange,
        getStatisticsByType,
        getStatisticsByResult,
        getRecentActivity,
        getRecentActivityByUser,
        setSelectedAction,
        clearStatistics,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};