import type { ProjectStatus } from "./projectTypes";

export interface PendingReviewDto {
  projectId: number;
  projectName: string;
  objectives: string;
  beneficiaryPopulations: string;
  budget: number;
  projectStartAt: string;
  projectEndAt: string;
  projectStatus: ProjectStatus;

  creatorId: number | null;
  creatorName: string;
  creatorEmail: string | null;

  reviewId: number;
  assignedAt: string;
  dueAt: string;
  reviewedAt: string | null;
  currentNotes: string | null;

  daysUntilDue: number;
  isOverdue: boolean;
  isDueSoon: boolean;
  daysInReview: number;
  isResubmission: boolean;

  projectCreatedAt: string;
  daysSinceCreation: number;

  priorityLevel: ProjectPriority;
  statusMessage: string;
}

export type ProjectPriority = "CRÍTICA" | "ALTA" | "MEDIA" | "NORMAL";

export interface QueueStatistics {
  total: number;
  overdue: number;
  dueSoon: number;
  criticalPriority: number;
  highPriority: number;
  resubmissions: number;
}

export interface PendingReviewQueueDto {
  reviews: PendingReviewDto[];
  statistics: QueueStatistics;
}


export interface ReviewHistoryDto {
  projectId: number;
  projectName: string;
  objectives: string;
  beneficiaryPopulations: string;
  budget: number;
  projectStartAt: string;
  projectEndAt: string;
  projectStatus: ProjectStatus;
  
  creatorId: number | null;
  creatorName: string;
  creatorEmail: string | null;
  
  reviewId: number;
  assignedAt: string;
  reviewedAt: string;
  dueAt: string;
  notes: string | null;
  
  daysToComplete: number | null;
  wasOverdue: boolean | null;
  isResubmission: boolean;
  
  projectCreatedAt: string;
  
  votingStartAt: string | null;
  votingEndAt: string | null;
}

export interface HistoryStatistics {
  total: number;
  metrics: {
    approved: number;
    returned: number;
    rejected: number;
    resubmissions: number;
    averageDaysToComplete: number;
    completedOnTime: number;
    completedOverdue: number;
    approvalRate?: number;
    returnRate?: number;
    onTimeRate?: number;
  };
}

export interface PagedResponse<T> {
  page: {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
  statistics: HistoryStatistics;
}

export interface ReviewHistoryFilters {
  searchTerm?: string;
  status?: ProjectStatus;
  outcome?: "APROBADO" | "DEVUELTO" | "RECHAZADO" | "all";
  wasOverdue?: boolean;
  isResubmission?: boolean;
  reviewedFrom?: string;
  reviewedTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface LoadingCuratorState {
  fetchingQueue: boolean;
  fetchingDetails: boolean;
  fetchingProjects: boolean;
  fetchingHistory: boolean; 
  addingObservations: boolean;
  approvingProject: boolean;
}