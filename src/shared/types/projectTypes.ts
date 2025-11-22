import type { User } from "./userTYpes";

export interface ProjectDto {
  id: number;
  name: string;
  description: string;
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
  | "OPEN_FOR_VOTING"
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
  voting: boolean;
}

export type ProjectReadyDto = {
  id: number;
  name: string;
  description: string;
  objectives: string;
  beneficiaryPopulations: string;
  budget: number;
  startAt: string;
  endAt: string;
  votingStartAt: string | null;
  votingEndAt: string | null;
  createdAt: string;
  status: string;
  creator: User;
  version: number;
  votingSchedule: VotingScheduleInfo;
};

export type VotingScheduleInfo = {
  hasScheduledVoting: boolean;
  daysUntilVotingStarts: number | null;
  plannedVotingDurationDays: number | null;
  scheduleStatus: string;
};

export type ProjectVotingDto = {
  id: number;
  name: string;
  description: string;
  objectives: string;
  beneficiaryPopulations: string;
  budget: number;
  startAt: string;
  endAt: string;
  votingStartAt: string;
  votingEndAt: string;
  createdAt: string;
  status: string;
  creator: User;
  version: number;
  votingInfo: VotingActiveInfo;
  userVotingStatus: userVotingStatus;
};

export type VotingActiveInfo = {
  isOpen: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  totalVotingDays: number;
  progressPercentage: number;
  urgencyLevel: "CRITICAL" | "HIGH" | "NORMAL";
  statusMessage: string;
};

export type userVotingStatus = {
  hasVoted: boolean;
  voteDecision: boolean;
  votedAt: string;
  message: string;
};
