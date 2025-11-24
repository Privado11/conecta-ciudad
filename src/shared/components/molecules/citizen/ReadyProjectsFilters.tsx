import { Filter } from "lucide-react";
import { DynamicFilter } from "@/shared/components/molecules/DynamicFilter";
import type { FilterGroup } from "@/shared/interface/Filters";

interface ReadyFilters {
  searchTerm: string;
}

interface ReadyProjectsFiltersProps {
  filters: ReadyFilters;
  handlers: {
    onSearchChange: (value: string) => void;
  };
}

export function ReadyProjectsFilters({
  filters,
  handlers,
}: ReadyProjectsFiltersProps) {
  const filterGroups: FilterGroup<ReadyFilters["searchTerm"]>[] = [
    {
      filterKey: "searchTerm",
      label: "Estado de votación",
      activeValue: "",
      onChange: handlers.onSearchChange
    },
  ];

  return (
    <DynamicFilter
      title="Filtros de proyectos"
      titleIcon={Filter}
      searchTerm={filters.searchTerm}
      onSearchChange={handlers.onSearchChange}
      searchPlaceholder="Buscar por nombre de proyecto..."
      filterGroups={filterGroups}
    />
  );
}