import type { ReactNode } from "react";

export type ColumnType =
  | "text"
  | "number"
  | "date"
  | "badge"
  | "actions"
  | "custom";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeConfig {
  label: string;
  variant: BadgeVariant;
}

export interface ColumnConfig<T = any> {
  key: string;
  label: string;
  type: ColumnType;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";

  accessor?: (row: T) => any;
  format?: (value: any, row: T) => string | ReactNode;

  badgeConfig?: (row: T) => BadgeConfig;
  render?: (row: T) => ReactNode;

  className?: string;
  headerClassName?: string;
}

export interface ActionConfig<T = any> {
  label: string | ((row: T) => string);
  icon?: ReactNode | ((row: T) => ReactNode);
  onClick: (row: T) => void;
  render?: (row: T) => ReactNode;
  variant?: "default" | "ghost" | "destructive";
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
  className?: string;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  pageSizeOptions?: number[];
}

export interface DynamicTableConfig<T = any> {
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  actionsLabel?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  loadingFilterMessage?: string;
  showPagination?: boolean;
  showPageSize?: boolean;
  rowKey: string | ((row: T) => string | number);
}

export interface DynamicTableProps<T = any> {
  config: DynamicTableConfig<T>;
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (field: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}
