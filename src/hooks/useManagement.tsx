import type {
  UseManagementConfig,
  UseManagementReturn,
} from "@/shared/interface/Management";
import { useState, useEffect, useCallback } from "react";

export function useManagement<TFilters extends Record<string, any>>({
  initialFilters,
  defaultSort = { sortBy: "id", sortDirection: "asc" },
  debounceDelay = 500,
  searchField,
}: UseManagementConfig<TFilters>): UseManagementReturn<TFilters> {
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState(defaultSort.sortBy);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    defaultSort.sortDirection
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    if (!searchField) return;

    const timer = setTimeout(() => {
      const searchValue = filters[searchField] as string;
      setDebouncedSearchTerm(searchValue || "");
      setCurrentPage(0);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchField ? filters[searchField] : null, debounceDelay, searchField]);

  const handleFilterChange = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(0);
    },
    []
  );

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  }, []);

  const handleSortChange = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortDirection("asc");
      }
    },
    [sortBy]
  );

  const resetPagination = useCallback(() => {
    setCurrentPage(0);
  }, []);

  return {
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    debouncedSearchTerm,

    setFilters,
    setCurrentPage,
    setPageSize,
    setSortBy,
    setSortDirection,

    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    resetPagination,
  };
}

export function useBuildApiFilters<TFilters extends Record<string, any>>(
  filters: TFilters,
  debouncedSearchTerm: string,
  searchFieldName: string,
  mappers?: Partial<Record<keyof TFilters, (value: any) => any>>
) {
  return useCallback(() => {
    const apiFilters: Record<string, any> = {};

    if (debouncedSearchTerm.trim()) {
      apiFilters[searchFieldName] = debouncedSearchTerm;
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "searchTerm") return;

      if (value === "all") return;

      if (mappers && mappers[key as keyof TFilters]) {
        apiFilters[key] = mappers[key as keyof TFilters]!(value);
      } else {
        apiFilters[key] = value;
      }
    });

    return apiFilters;
  }, [filters, debouncedSearchTerm, searchFieldName, mappers]);
}
