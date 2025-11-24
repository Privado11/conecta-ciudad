import { BarChart3 } from "lucide-react";
import { DynamicFilter } from "../../DynamicFilter";

type VotingStatusFilter = "all" | "open" | "closed" | "approved" | "rejected";

interface FilterHandlers {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: VotingStatusFilter) => void;
}

interface VotingSearchAndFiltersProps {
  searchTerm: string;
  statusFilter: VotingStatusFilter;
  handlers: FilterHandlers;
}

const VOTING_STATUS_FILTERS = [
  { value: "all", label: "Todas", count: 0 },
  { value: "open", label: "Abiertas", count: 0 },
  { value: "closed", label: "Cerradas", count: 0 },
  { value: "approved", label: "Aprobadas", count: 0 },
  { value: "rejected", label: "Rechazadas", count: 0 },
];

export function VotingSearchAndFilters({
  searchTerm,
  statusFilter,
  handlers,
}: VotingSearchAndFiltersProps) {
  const filterGroups = [
    {
      label: "Estado",
      filterKey: "status",
      options: VOTING_STATUS_FILTERS,
      activeValue: statusFilter,
      onChange: handlers.onStatusChange,
    },
  ];

  return (
    <DynamicFilter
      title="Filtros de búsqueda"
      titleIcon={BarChart3}
      searchTerm={searchTerm}
      onSearchChange={handlers.onSearchChange}
      searchPlaceholder="Buscar por nombre del proyecto..."
      filterGroups={filterGroups}
    />
  );
}
