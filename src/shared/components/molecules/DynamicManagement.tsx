import type { ManagementConfig } from "@/shared/interface/Management";
import { useEffect, useState } from "react";
import { StatCard } from "../atoms/StatCard";
import { DynamicTable } from "./DynamicTable";

export function GenericManagement<T = any>({
  title,
  description,
  icon: Icon,
  stats,
  data,
  loading,
  pagination,
  statistics,
  tableConfig,
  filters = [],
  searchPlaceholder = "Buscar...",
  FiltersComponent,
  filtersProps,
  onLoadData,
  defaultSortBy = "name",
  defaultSortDirection = "asc",
  additionalModals,
}: ManagementConfig<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    defaultSortDirection
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    debouncedSearchTerm,
    ...Object.values(filterValues),
  ]);

  const loadData = () => {
    const apiFilters: any = {
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDirection,
    };

    if (debouncedSearchTerm.trim()) {
      apiFilters.name = debouncedSearchTerm;
    }

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== "all" && value !== undefined && value !== null) {
        apiFilters[key] = value;
      }
    });

    onLoadData(apiFilters);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const getActiveFiltersMessage = () => {
    const activeFilters = [];

    if (debouncedSearchTerm) {
      activeFilters.push(`búsqueda: "${debouncedSearchTerm}"`);
    }

    filters.forEach((filter) => {
      const value = filterValues[filter.key];
      if (value && value !== "all") {
        const filterLabel = filter.label || filter.key;
        activeFilters.push(`${filterLabel}: ${value}`);
      }
    });

    return activeFilters.length > 0 ? activeFilters.join(", ") : null;
  };

  const activeFiltersMessage = getActiveFiltersMessage();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {stats.map(({ label, icon: StatIcon, color, valueKey }) => {
          const metricValue =
            valueKey === "total"
              ? pagination.totalElements
              : (statistics?.metrics?.[valueKey] as number) || 0;

          return (
            <StatCard
              key={label}
              label={label}
              value={metricValue}
              icon={<StatIcon className="w-8 h-8" />}
              iconColor={color}
              valueColor={
                valueKey === "active"
                  ? "text-green-600"
                  : valueKey === "inactive"
                  ? "text-red-600"
                  : undefined
              }
            />
          );
        })}
      </div>

      {FiltersComponent ? (
        <FiltersComponent
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          {...filtersProps}
        />
      ) : (
        <div className="mb-6 bg-card rounded-lg border border-border p-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg"
          />
        </div>
      )}

      {activeFiltersMessage && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Filtros activos:</span>{" "}
            {activeFiltersMessage}
            {" · "}
            <strong>{pagination.totalElements}</strong> resultado(s)
            encontrado(s)
          </p>
        </div>
      )}

      <DynamicTable
        config={tableConfig}
        data={data}
        loading={loading}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalElements: pagination.totalElements,
          pageSize: pagination.pageSize,
        }}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
      />

      {additionalModals}
    </div>
  );
}
