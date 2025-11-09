import type { User } from "../types/userTYpes";

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

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
}

export interface PagedUserResponse {
  page: PaginatedResponse<User>;
  statistics: UserStatistics;
}