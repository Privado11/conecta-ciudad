import { create } from "zustand";
import { logger } from "../middleware/logger";
import AdminAuditService from "@/service/admin/AdminAuditService";
import type { SearchFilters } from "@/service/admin/AdminAuditService";
import type { PagedResponse } from "@/shared/interface/PaginatedResponse";
import type { ActionDto, ActionDetails } from "@/shared/types/auditTypes";
import { toast } from "sonner";

interface LoadingState {
  fetching: boolean;
  exporting: boolean;
}

interface AdminAuditState {
  auditLogs: PagedResponse<ActionDto> | null;
  selectedAction: ActionDetails | null;
  loading: LoadingState;

  // Actions
  searchActions: (filters: SearchFilters) => Promise<void>;
  exportActions: (
    filters: SearchFilters,
    format?: "csv" | "excel"
  ) => Promise<Blob>;
  getActionDetails: (actionId: number) => Promise<void>;
  setSelectedAction: (action: ActionDetails | null) => void;
}

const initialLoadingState: LoadingState = {
  fetching: false,
  exporting: false,
};

export const useAdminAuditStore = create<AdminAuditState>()(
  logger(
    (set) => ({
      auditLogs: null,
      selectedAction: null,
      loading: initialLoadingState,

      searchActions: async (filters: SearchFilters) => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const auditLogs = await AdminAuditService.searchActions(filters);
          set({ auditLogs });
        } catch (error: any) {
          toast.error(error.message || "Error al buscar acciones de auditoría");
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      exportActions: async (
        filters: SearchFilters,
        format: "csv" | "excel" = "csv"
      ) => {
        set((state) => ({ loading: { ...state.loading, exporting: true } }));
        try {
          const blob = await AdminAuditService.exportActions(filters, format);
          return blob;
        } catch (error: any) {
          toast.error(error.message || "Error al exportar acciones");
          throw error;
        } finally {
          set((state) => ({ loading: { ...state.loading, exporting: false } }));
        }
      },

      getActionDetails: async (actionId: number) => {
        set((state) => ({ loading: { ...state.loading, fetching: true } }));
        try {
          const actionDetails = await AdminAuditService.getActionDetails(
            actionId
          );
          set({ selectedAction: actionDetails });
        } catch (error: any) {
          toast.error(error.message || "Error al obtener detalles de acción");
        } finally {
          set((state) => ({ loading: { ...state.loading, fetching: false } }));
        }
      },

      setSelectedAction: (action: ActionDetails | null) => {
        set({ selectedAction: action });
      },
    }),
    "AdminAuditStore"
  )
);
