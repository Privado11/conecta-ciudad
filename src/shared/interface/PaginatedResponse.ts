export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}


export interface Statistics<T> {
  total: number;
  metrics: Record<string, number | string | boolean | null>;
}


export interface PagedResponse<T> {
  page: PaginatedResponse<T>;
  statistics: Statistics<T>;
}
