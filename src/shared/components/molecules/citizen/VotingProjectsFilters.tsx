import { Filter } from "lucide-react";
import { DynamicFilter } from "@/shared/components/molecules/DynamicFilter";
import type { FilterGroup } from "@/shared/interface/Filters";

interface VotingFilters {
  searchTerm: string;
  urgency: "all" | "CRITICAL" | "HIGH" | "NORMAL";
}

interface VotingProjectsFiltersProps {
  filters: VotingFilters;
  handlers: {
    onSearchChange: (value: string) => void;
    onUrgencyChange: (value: VotingFilters["urgency"]) => void;
  };
}

export function VotingProjectsFilters({
  filters,
  handlers,
}: VotingProjectsFiltersProps) {
  const filterGroups: FilterGroup<VotingFilters["urgency"]>[] = [
    {
      filterKey: "urgency",
      label: "Urgencia de votación",
      activeValue: filters.urgency,
      onChange: handlers.onUrgencyChange,
      options: [
        { label: "Todos", value: "all" },
        { label: "Vence hoy/mañana", value: "CRITICAL" },
        { label: "Vence pronto", value: "HIGH" },
        { label: "Normal", value: "NORMAL" },
      ],
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