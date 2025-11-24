import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { VotingResultFilter } from "@/shared/types/votingTypes";

interface VotingResultsFiltersProps {
  searchTerm: string;
  resultFilter: VotingResultFilter;
  handlers: {
    onSearchChange: (value: string) => void;
    onResultChange: (value: VotingResultFilter) => void;
  };
}

export function VotingResultsFilters({
  searchTerm,
  resultFilter,
  handlers,
}: VotingResultsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar proyectos..."
          value={searchTerm}
          onChange={(e) => handlers.onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={resultFilter}
        onValueChange={(value) =>
          handlers.onResultChange(value as VotingResultFilter)
        }
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filtrar por resultado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="approved">Aprobados</SelectItem>
          <SelectItem value="rejected">Rechazados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
