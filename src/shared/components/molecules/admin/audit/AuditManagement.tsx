import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { useAudit } from "@/hooks/useAudit";
import type {
  ActionResult,
  ActionType,
  EntityType,
} from "@/shared/types/auditTypes";
import { AUDIT_STATS } from "@/shared/constants/audit/auditStats";
import { DynamicTable } from "../../DynamicTable";
import { createAuditTableConfig } from "@/config/table/AuditTableConfig";
import { AuditSearchAndFilters } from "./AuditSearchAndFilters";

import { StatsGrid } from "../../StatsGrid";
import { useManagement } from "@/hooks/useManagement";
import type { AuditFilters, TempDateFilters } from "@/shared/interface/Filters";
import { ENTITY_BADGE_CONFIG } from "@/shared/constants/audit/auditEntity";
import { ACTION_BY_ENTITY } from "@/shared/constants/audit/auditFilters";
import { ActionDetailsModal } from "./ActionDetailsModal";

export default function AuditManagement() {
  const {
    auditLogs,
    selectedAction,
    loading,
    searchActions,
    getActionDetails,
    setSelectedAction,
  } = useAudit();

  const {
    filters,
    currentPage,
    pageSize,
    debouncedSearchTerm,
    setFilters,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useManagement<AuditFilters>({
    initialFilters: {
      searchTerm: "",
      actionType: "all",
      result: "all",
      entityType: "all",
      startDate: undefined,
      endDate: undefined,
    },
    searchField: "searchTerm",
  });

  const [tempDateFilters, setTempDateFilters] = useState<TempDateFilters>({
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    loadActions();
  }, [
    currentPage,
    pageSize,
    debouncedSearchTerm,
    filters.actionType,
    filters.result,
    filters.entityType,
    filters.startDate,
    filters.endDate,
  ]);

  const formatToLocalDateTime = (date: string | undefined) => {
    if (!date) return undefined;
    return `${date}T00:00:00`;
  };

  const loadActions = () => {
    searchActions({
      page: currentPage,
      size: pageSize,
      searchTerm: debouncedSearchTerm.trim() || undefined,
      actionType: filters.actionType !== "all" ? filters.actionType : undefined,
      result: filters.result !== "all" ? filters.result : undefined,
      entityType: filters.entityType !== "all" ? filters.entityType : undefined,
      startDate: formatToLocalDateTime(filters.startDate),
      endDate: filters.endDate ? `${filters.endDate}T23:59:59` : undefined,
    });
  };

  const filterHandlers = {
    onSearchChange: (value: string) => handleFilterChange("searchTerm", value),
    onActionTypeChange: (value: ActionType | "all") =>
      handleFilterChange("actionType", value),
    onActionResultChange: (value: ActionResult | "all") =>
      handleFilterChange("result", value),
    onEntityTypeChange: (value: EntityType | "all") =>
      handleFilterChange("entityType", value),
    onStartDateChange: (value: string | undefined) => {
      setTempDateFilters((prev) => ({ ...prev, startDate: value }));
    },
    onEndDateChange: (value: string | undefined) => {
      setTempDateFilters((prev) => ({ ...prev, endDate: value }));
    },
    onApplyDateFilter: () => {
      setFilters((prev) => ({
        ...prev,
        startDate: tempDateFilters.startDate,
        endDate: tempDateFilters.endDate,
      }));
      handlePageChange(0);
    },
    onClearDateFilters: () => {
      setTempDateFilters({ startDate: undefined, endDate: undefined });
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
      handlePageChange(0);
    },
  };

  const handleViewDetails = async (action: any) => {
    setSelectedAction(action);
    await getActionDetails(action.id);
  };

  const getActiveFiltersMessage = () => {
    const filterMessages: string[] = [];
    if (debouncedSearchTerm) {
      filterMessages.push(`"${debouncedSearchTerm}"`);
    }
    if (filters.actionType !== "all") {
      let actionLabel: string = filters.actionType;
      const actionsList =
        ACTION_BY_ENTITY[filters.entityType] || ACTION_BY_ENTITY["all"];
      const matchedAction = actionsList.find(
        (a) => a.value === filters.actionType
      );
      if (matchedAction) {
        actionLabel = matchedAction.label;
      }

      filterMessages.push(`tipo: ${actionLabel}`);
    }

    if (filters.result !== "all") {
      const resultLabel =
        filters.result === "SUCCESS"
          ? "exitosas"
          : filters.result === "FAILED"
          ? "fallidas"
          : filters.result;
      filterMessages.push(`resultado: ${resultLabel}`);
    }

    if (filters.entityType !== "all") {
      const entityLabel =
        ENTITY_BADGE_CONFIG[
          filters.entityType as keyof typeof ENTITY_BADGE_CONFIG
        ]?.label || filters.entityType;
      filterMessages.push(`entidad: ${entityLabel}`);
    }

    if (filters.startDate && filters.endDate) {
      filterMessages.push(`${filters.startDate} - ${filters.endDate}`);
    }
    return filterMessages.length > 0 ? filterMessages.join(" · ") : null;
  };

  const activeFiltersMessage = getActiveFiltersMessage();
  const auditTableConfig = createAuditTableConfig({
    onViewDetails: handleViewDetails,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
          </div>
          <p className="text-muted-foreground">
            Monitorea todas las acciones y eventos del sistema en tiempo real
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <StatsGrid
          stats={AUDIT_STATS}
          data={{
            totalElements: auditLogs?.page?.totalElements || 0,
            metrics: auditLogs?.statistics?.metrics,
          }}
          loading={loading.fetching && !auditLogs}
          columns={4}
        />

        <AuditSearchAndFilters
          filters={filters}
          tempDateFilters={tempDateFilters}
          handlers={filterHandlers}
        />
      </div>

      {activeFiltersMessage && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Filtros activos:</span>{" "}
            {activeFiltersMessage}
            {" · "}
            {loading.fetching ? (
              <span className="text-muted-foreground italic">Cargando...</span>
            ) : (
              <>
                <strong>{auditLogs?.page?.totalElements || 0}</strong>{" "}
                resultado(s)
              </>
            )}
          </p>
        </div>
      )}

      <DynamicTable
        config={auditTableConfig}
        data={auditLogs?.page?.content || []}
        loading={loading.fetching}
        pagination={{
          currentPage: auditLogs?.page?.number || 0,
          totalPages: auditLogs?.page?.totalPages || 0,
          totalElements: auditLogs?.page?.totalElements || 0,
          pageSize: auditLogs?.page?.size || 10,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <ActionDetailsModal
        action={selectedAction}
        open={!!selectedAction}
        onClose={() => setSelectedAction(null)}
        loading={loading.fetching}
      />
    </div>
  );
}
