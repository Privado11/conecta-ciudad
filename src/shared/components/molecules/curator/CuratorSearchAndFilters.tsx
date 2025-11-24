import { FolderKanban } from "lucide-react";
import { DynamicFilter } from "@/shared/components/molecules/DynamicFilter";
import type { CuratorFilters } from "@/shared/interface/Filters";
import { CURATOR_STATUS_FILTERS } from "@/shared/constants/curator/curatorStatusFilter";
import type { ProjectPriority } from "@/shared/types/curatorTypes";

interface FilterHandlers {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectPriority | "all") => void;
}

interface CuratorSearchAndFiltersProps {
  filters: CuratorFilters;
  handlers: FilterHandlers;
}



export function CuratorSearchAndFilters({
  filters,
  handlers,
}: CuratorSearchAndFiltersProps) {
  const filterGroups = [
    {
      label: "Estado",
      filterKey: "status",
      options: CURATOR_STATUS_FILTERS,
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
      searchPlaceholder="Buscar por nombre del proyecto o del creador..."
      filterGroups={filterGroups}
      
    />
  );
}