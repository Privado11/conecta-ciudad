import type { User } from "./userTYpes";

export interface ProjectDto {
  id: number;
  name: string;
  objectives: string;
  beneficiaryPopulations: string;
  budget: number;
  startAt: string | null;
  endAt: string | null;
  votingStartAt: string | null;
  votingEndAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  creator: User;
  version: number;
  reviews: ReviewDto[];
}

export interface ReviewDto {
  id: number;
  curator: User;
  notes: string;
  startAt: string;
  dueAt: string | null;
  reviewedAt: string | null;
}

export type ProjectStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "IN_REVIEW"
  | "RETURNED_WITH_OBSERVATIONS"
  | "READY_TO_PUBLISH"
  | "PUBLISHED"
  | "REJECTED"
  | "VOTING_CLOSED";

  export interface ProjectSaveDto {
    name: string;
    objectives: string;
    beneficiaryPopulations: string;
    budget: number;
    startAt: string | null;
    endAt: string | null;
  }
  

export interface ReviewNotesDto {
  notes: string;
}

export interface LoadingProjectState {
  fetching: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  fetchingDetails: boolean;
  assigningCurator: boolean;
}
