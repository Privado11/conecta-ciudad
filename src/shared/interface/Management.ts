export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface SortState {
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface UseManagementConfig<TFilters> {
  initialFilters: TFilters;
  defaultSort?: SortState;
  debounceDelay?: number;
  searchField?: keyof TFilters;
}

export interface UseManagementReturn<TFilters> {
  filters: TFilters;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
  debouncedSearchTerm: string;
  
  setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  
  handleFilterChange: <K extends keyof TFilters>(
    key: K,
    value: TFilters[K]
  ) => void;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newSize: number) => void;
  handleSortChange: (field: string) => void;
  resetPagination: () => void;
}