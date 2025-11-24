import { History } from "lucide-react";
import { DynamicFilter } from "@/shared/components/molecules/DynamicFilter";
import type {
  ReviewHistoryFilters,
  TempDateFilters,
} from "@/shared/interface/Filters";
import { REVIEW_OUTCOME_FILTERS } from "@/shared/constants/curator/reviewOutcomeFilters";

interface FilterHandlers {
  onSearchChange: (value: string) => void;
  onOutcomeChange: (
    value: "all" | "APROBADO" | "DEVUELTO" | "RECHAZADO"
  ) => void;

  onWasOverdueChange: (value: boolean | undefined) => void;
  onIsResubmissionChange: (value: boolean | undefined) => void;
  onStartDateChange: (value: string | undefined) => void;
  onEndDateChange: (value: string | undefined) => void;
  onApplyDateFilter: () => void;
  onClearDateFilters: () => void;
}

interface ReviewHistorySearchAndFiltersProps {
  filters: ReviewHistoryFilters;
  tempDateFilters: TempDateFilters;
  handlers: FilterHandlers;
}

export function ReviewHistorySearchAndFilters({
  filters,
  tempDateFilters,
  handlers,
}: ReviewHistorySearchAndFiltersProps) {
  const filterGroups = [
    {
      label: "Resultado",
      filterKey: "outcome",
      options: REVIEW_OUTCOME_FILTERS,
      activeValue: filters.outcome,
      onChange: handlers.onOutcomeChange,
    },
    {
      label: "Completado Tarde",
      filterKey: "wasOverdue",
      options: [
        { value: "all", label: "Todos" },
        { value: "true", label: "Sí" },
        { value: "false", label: "No" },
      ],
      activeValue:
        filters.wasOverdue === undefined ? "all" : String(filters.wasOverdue),
      onChange: (value: string) =>
        handlers.onWasOverdueChange(
          value === "all" ? undefined : value === "true"
        ),
    },
    {
      label: "Reenvíos",
      filterKey: "isResubmission",
      options: [
        { value: "all", label: "Todos" },
        { value: "true", label: "Solo reenvíos" },
        { value: "false", label: "Sin reenvíos" },
      ],
      activeValue:
        filters.isResubmission === undefined
          ? "all"
          : String(filters.isResubmission),
      onChange: (value: string) =>
        handlers.onIsResubmissionChange(
          value === "all" ? undefined : value === "true"
        ),
    },
  ];

  return (
    <DynamicFilter
      title="Filtros de historial"
      titleIcon={History}
      searchTerm={filters.searchTerm}
      onSearchChange={handlers.onSearchChange}
      searchPlaceholder="Buscar por nombre del proyecto o creador..."
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
