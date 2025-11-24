import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { VotingDecisionFilter } from "@/shared/types/votingTypes";

interface VotingHistoryFiltersProps {
  searchTerm: string;
  decisionFilter: VotingDecisionFilter;
  handlers: {
    onSearchChange: (value: string) => void;
    onDecisionChange: (value: VotingDecisionFilter) => void;
  };
}

export function VotingHistoryFilters({
  searchTerm,
  decisionFilter,
  handlers,
}: VotingHistoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar proyectos votados..."
          value={searchTerm}
          onChange={(e) => handlers.onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={decisionFilter}
        onValueChange={(value) =>
          handlers.onDecisionChange(value as VotingDecisionFilter)
        }
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filtrar por decisión" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="favor">A Favor</SelectItem>
          <SelectItem value="against">En Contra</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
