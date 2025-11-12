import { ShieldCheck } from "lucide-react";
import { useMemo, useEffect } from "react";
import type {
  ActionResult,
  ActionType,
  EntityType,
} from "@/shared/types/auditTypes";
import {
  ACTION_ENTITY_FILTERS,
  ACTION_RESULT_FILTERS,
  ACTION_BY_ENTITY,
} from "@/shared/constants/audit/auditFilters";
import { DynamicFilter } from "../DynamicFilter";
import type { AuditFilters, TempDateFilters } from "@/shared/interface/Filters";

interface FilterHandlers {
  onSearchChange: (value: string) => void;
  onActionTypeChange: (value: ActionType | "all") => void;
  onActionResultChange: (value: ActionResult | "all") => void;
  onEntityTypeChange: (value: EntityType | "all") => void;
  onStartDateChange: (value: string | undefined) => void;
  onEndDateChange: (value: string | undefined) => void;
  onApplyDateFilter: () => void;
  onClearDateFilters: () => void;
}

interface AuditSearchAndFiltersProps {
  filters: AuditFilters;
  tempDateFilters: TempDateFilters;
  handlers: FilterHandlers;
}

export function AuditSearchAndFilters({
  filters,
  tempDateFilters,
  handlers,
}: AuditSearchAndFiltersProps) {
  const availableActions = useMemo(
    () => ACTION_BY_ENTITY[filters.entityType] || ACTION_BY_ENTITY.all,
    [filters.entityType]
  );

  useEffect(() => {
    if (filters.entityType !== "all") {
      const isActionAvailable = availableActions.some(
        (action) => action.value === filters.actionType
      );

      if (!isActionAvailable && filters.actionType !== "all") {
        handlers.onActionTypeChange("all");
      }
    }
  }, [filters.entityType, filters.actionType, availableActions, handlers]);

  const handleEntityChange = (value: EntityType | "all") => {
    handlers.onEntityTypeChange(value);
  };

  const filterGroups = [
    {
      label: "Tipo de entidad",
      filterKey: "entityType",
      options: ACTION_ENTITY_FILTERS,
      activeValue: filters.entityType,
      onChange: handleEntityChange,
    },
    {
      label:
        filters.entityType !== "all"
          ? `Tipo de acción (${ACTION_ENTITY_FILTERS.find(
              (e) => e.value === filters.entityType
            )?.label.toLowerCase()})`
          : "Tipo de acción",
      filterKey: "actionType",
      options: availableActions,
      activeValue: filters.actionType,
      onChange: handlers.onActionTypeChange,
    },
    {
      label: "Resultado de acción",
      filterKey: "actionResult",
      options: ACTION_RESULT_FILTERS,
      activeValue: filters.result,
      onChange: handlers.onActionResultChange,
    },
  ];

  return (
    <DynamicFilter
      title="Filtros de búsqueda"
      titleIcon={ShieldCheck}
      searchTerm={filters.searchTerm}
      onSearchChange={handlers.onSearchChange}
      searchPlaceholder="Buscar por nombre o correo..."
      filterGroups={filterGroups}
      startDate={tempDateFilters.startDate}
      endDate={tempDateFilters.endDate}
      onStartDateChange={handlers.onStartDateChange}
      onEndDateChange={handlers.onEndDateChange}
      onApplyDateFilter={handlers.onApplyDateFilter}
      onClearDateFilters={handlers.onClearDateFilters}
    />
  );
}
