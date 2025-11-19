import type { LucideIcon } from "lucide-react";
import type { ActionResult, ActionType, EntityType } from "../types/auditTypes";
import type { UserRole, UserStatus } from "../types/userTYpes";
import type { ProjectStatus } from "../types/projectTypes";
import type { ProjectPriority } from "../types/curatorTypes";

export interface FilterOption<T> {
  label: string;
  value: T;
  icon?: LucideIcon;
}

export interface FilterGroup<T> {
  label: string;
  filterKey: string;
  options: FilterOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
}

export interface AuditFilters {
  searchTerm: string;
  actionType: ActionType | "all";
  result: ActionResult | "all";
  entityType: EntityType | "all";
  startDate?: string;
  endDate?: string;
}

export interface TempDateFilters {
  dateType?: "projectStart" | "projectEnd" | "votingStart" | "votingEnd" | "created";
  startDate?: string;
  endDate?: string;
}

export interface UserFilters {
  searchTerm: string;
  role: UserRole | "all";
  status: UserStatus | "all";
}

export interface ProjectFilters {
  searchTerm: string;
  status: ProjectStatus | "all";

  projectStartFrom?: string;
  projectStartTo?: string;
  projectEndFrom?: string;
  projectEndTo?: string;

  votingStartFrom?: string;
  votingStartTo?: string;
  votingEndFrom?: string;
  votingEndTo?: string;

  createdFrom?: string;
  createdTo?: string;
}

export interface CuratorFilters {
  searchTerm: string;
  status: ProjectPriority | "all";
}

export interface ReviewHistoryFilters {
  searchTerm: string;
  outcome: "all" | "APROBADO" | "DEVUELTO" | "RECHAZADO";
  status: ProjectStatus | "all";
  wasOverdue?: boolean;
  isResubmission?: boolean;
  reviewedFrom?: string;
  reviewedTo?: string;
}
