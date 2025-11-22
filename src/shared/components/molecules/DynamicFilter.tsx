import {
  Search,
  X,
  ChevronDown,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, type ReactNode } from "react";
import type { FilterGroup } from "@/shared/interface/Filters";

interface DynamicFilterProps<T extends Record<string, any>> {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterGroups: FilterGroup<any>[];
  headerActions?: ReactNode;
  titleIcon?: LucideIcon;

  dateType?: string;
  startDate?: string;
  endDate?: string;
  dateTypeOptions?: Array<{ value: string; label: string }>;
  onDateTypeChange?: (value: string) => void;
  onStartDateChange?: (value: string | undefined) => void;
  onEndDateChange?: (value: string | undefined) => void;
  onApplyDateFilter?: () => void;
  onClearDateFilters?: () => void;
}

export function DynamicFilter<T extends Record<string, any>>({
  title,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filterGroups,
  headerActions,
  titleIcon: TitleIcon,
  dateType,
  startDate,
  endDate,
  dateTypeOptions,
  onDateTypeChange,
  onStartDateChange,
  onEndDateChange,
  onApplyDateFilter,
  onClearDateFilters,
}: DynamicFilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount =
    filterGroups.filter(
      (group) => group.activeValue !== "all" && group.activeValue !== ""
    ).length + (startDate || endDate ? 1 : 0);

  const clearAllFilters = () => {
    filterGroups.forEach((group) => {
      group.onChange("all" as any);
    });
    onSearchChange("");
    if (onClearDateFilters) onClearDateFilters();
  };

  const clearDateFilters = () => {
    if (onClearDateFilters) onClearDateFilters();
  };

  const hasActiveFilters = activeFiltersCount > 0 || searchTerm.length > 0;

  const hasAdvancedFilters =
    filterGroups.some((group) => group.options && group.options.length > 0) ||
    (onStartDateChange && onEndDateChange);

  return (
    <Card className="mb-6 border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {TitleIcon && (
              <TitleIcon className="w-5 h-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {headerActions}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar todo
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="search"
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 cursor-pointer"
                onClick={() => onSearchChange("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {hasAdvancedFilters && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between !p-0 hover:bg-transparent hover:text-foreground cursor-pointer"
              >
                <span className="text-sm font-medium">Filtros avanzados</span>
                <ChevronDown
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-6 pt-4">
              {onStartDateChange && onEndDateChange && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Filtro por fecha
                      </Label>
                      {(startDate || endDate) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearDateFilters}
                          className="h-auto p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>

                    {dateTypeOptions && onDateTypeChange && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="dateType"
                          className="text-xs text-muted-foreground"
                        >
                          Tipo de fecha
                        </Label>
                        <Select
                          value={dateType}
                          onValueChange={onDateTypeChange}
                        >
                          <SelectTrigger id="dateType">
                            <SelectValue placeholder="Seleccionar tipo de fecha" />
                          </SelectTrigger>
                          <SelectContent>
                            {dateTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="startDate"
                          className="text-xs text-muted-foreground"
                        >
                          Fecha desde
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate || ""}
                          onChange={(e) =>
                            onStartDateChange(e.target.value || undefined)
                          }
                          max={endDate || undefined}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="endDate"
                          className="text-xs text-muted-foreground"
                        >
                          Fecha hasta
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate || ""}
                          onChange={(e) =>
                            onEndDateChange(e.target.value || undefined)
                          }
                          min={startDate || undefined}
                        />
                      </div>
                    </div>
                    {startDate && endDate && (
                      <Button
                        onClick={onApplyDateFilter}
                        size="sm"
                        className="w-full cursor-pointer mt-3"
                      >
                        Aplicar filtro de fecha
                      </Button>
                    )}
                  </div>
                  <Separator />
                </>
              )}

              {filterGroups.map((group, index) => (
                <div key={group.filterKey}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {group.label}
                      </Label>
                      {group.activeValue !== "all" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => group.onChange("all" as any)}
                          className="h-auto p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer "
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.options?.map(({ label, value, icon: Icon }) => (
                        <Button
                          key={String(value)}
                          variant={
                            group.activeValue === value ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => group.onChange(value)}
                          className="gap-2 transition-all cursor-pointer"
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          <span>{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  {index < filterGroups.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
