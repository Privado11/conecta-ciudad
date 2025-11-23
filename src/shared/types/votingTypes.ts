import type { User } from "./userTYpes";
import type { ProjectStatus } from "./projectTypes";

export interface VotingProjectDto {
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
  status: ProjectStatus;
  creator: User;
  version: number;

  // Voting specific data
  votingStatus: "OPEN" | "CLOSED";
  votesInFavor: number;
  votesAgainst: number;
  totalVotes: number;
  participationRate: number;

  
  daysRemaining?: number;
  hoursRemaining?: number;
  urgencyLevel?: "CRITICAL" | "HIGH" | "NORMAL";

 
  finalResult?: "APPROVED" | "REJECTED";
  closedAt?: string;
  approvalPercentage?: number;
}

export interface VotingStats {
  totalVotations: number;
  openVotations: number;
  closedVotations: number;
  totalVotesCast: number;
  averageParticipationRate: number;
  approvalRate: number;
  rejectionRate: number;
  averageVotesPerProject: number;
}

export interface VoteResults {
  projectId: number;
  projectName: string;
  votesInFavor: number;
  votesAgainst: number;
  totalVotes: number;
  approvalPercentage: number;
  finalResult: "APPROVED" | "REJECTED";
  closedAt: string;
}

export interface LoadingVotingState {
  fetching: boolean;
  fetchingStats: boolean;
}

export type VotingFilter = "all" | "open" | "closed";
