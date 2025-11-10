import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import type {
  ActionResult,
  ActionType,
  EntityType,
} from "@/shared/types/auditTypes";
import {
  ACTION_ENTITY_FILTERS,
  ACTION_RESULT_FILTERS,
  ACTION_TYPE_FILTERS,
} from "@/shared/constants/audit/auditFilters";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterActionType: ActionType | "all";
  onActionTypeChange: (value: ActionType | "all") => void;
  filterActionResult: ActionResult | "all";
  onActionResultChange: (value: ActionResult | "all") => void;
  filterEntityType: EntityType | "all";
  onEntityTypeChange: (value: EntityType | "all") => void;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  filterActionType,
  onActionTypeChange,
  filterActionResult,
  onActionResultChange,
  filterEntityType,
  onEntityTypeChange,
}: SearchAndFiltersProps) {
  return (
    <Card className="mb-6 border-border shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Filtros de búsqueda
            </CardTitle>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {ACTION_TYPE_FILTERS.map(({ label, value, icon: Icon }) => (
              <Button
                key={value}
                variant={filterActionType === value ? "default" : "outline"}
                size="sm"
                onClick={() => onActionTypeChange(value as ActionType | "all")}
                className="gap-1 cursor-pointer"
              >
                {Icon && <Icon className="w-3 h-3" />}
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {ACTION_RESULT_FILTERS.map(({ label, value, icon: Icon }) => (
              <Button
                key={value}
                variant={filterActionResult === value ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onActionResultChange(value as ActionResult | "all")
                }
                className="gap-1 cursor-pointer"
              >
                {Icon && <Icon className="w-3 h-3" />}
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {ACTION_ENTITY_FILTERS.map(({ label, value, icon: Icon }) => (
              <Button
                key={value}
                variant={filterEntityType === value ? "default" : "outline"}
                size="sm"
                onClick={() => onEntityTypeChange(value as EntityType | "all")}
                className="gap-1 cursor-pointer"
              >
                {Icon && <Icon className="w-3 h-3" />}
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
