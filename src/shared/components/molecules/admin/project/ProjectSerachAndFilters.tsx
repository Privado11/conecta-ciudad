import { FolderKanban } from "lucide-react";
import { DynamicFilter } from "../../DynamicFilter";
import type {
  ProjectFilters,
  TempDateFilters,
} from "@/shared/interface/Filters";
import type { ProjectStatus } from "@/shared/types/projectTypes";
import { PROJECT_STATUS_FILTERS } from "@/shared/constants/project/ProjecrFilter";

interface FilterHandlers {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus | "all") => void;
  onDateTypeChange: (value: string) => void;
  onStartDateChange: (value: string | undefined) => void;
  onEndDateChange: (value: string | undefined) => void;
  onApplyDateFilter: () => void;
  onClearDateFilters: () => void;
}

interface ProjectSearchAndFiltersProps {
  filters: ProjectFilters;
  tempDateFilters: TempDateFilters;
  handlers: FilterHandlers;
}

const DATE_TYPE_OPTIONS = [
  { value: "projectStart", label: "Inicio del proyecto" },
  { value: "projectEnd", label: "Fin del proyecto" },
  { value: "votingStart", label: "Inicio de votación" },
  { value: "votingEnd", label: "Fin de votación" },
  { value: "created", label: "Fecha de creación" },
];

export function ProjectSearchAndFilters({
  filters,
  handlers,
  tempDateFilters,
}: ProjectSearchAndFiltersProps) {
  const filterGroups = [
    {
      label: "Estado",
      filterKey: "status",
      options: PROJECT_STATUS_FILTERS,
      activeValue: filters.status,
      onChange: handlers.onStatusChange,
    },
  ];

  return (
    <DynamicFilter
      title="Filtros de búsqueda"
      titleIcon={FolderKanban}
      searchTerm={filters.searchTerm}
      onSearchChange={handlers.onSearchChange}
      searchPlaceholder="Buscar por nombre, objetivos o población..."
      filterGroups={filterGroups}
      dateType={tempDateFilters.dateType}
      startDate={tempDateFilters.startDate}
      endDate={tempDateFilters.endDate}
      dateTypeOptions={DATE_TYPE_OPTIONS}
      onDateTypeChange={handlers.onDateTypeChange}
      onStartDateChange={handlers.onStartDateChange}
      onEndDateChange={handlers.onEndDateChange}
      onApplyDateFilter={handlers.onApplyDateFilter}
      onClearDateFilters={handlers.onClearDateFilters}
    />
  );
}