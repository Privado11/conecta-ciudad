export interface IUser {
  id: number;
  name: string;
  email: string;
}

export type ProjectStatus =
  | "DRAFT"
  | "RETURNED_WITH_OBSERVATIONS"
  | "OPEN_FOR_VOTING"
  | "VOTING_CLOSED"
  | "IN_REVIEW";

export interface IProject {
  id: number;
  name: string;
  objectives: string;
  beneficiaryPopulations: string;
  budgets: string | number;
  startAt: string;
  endAt: string;
  status: ProjectStatus;
  creator: IUser;
  curator: IUser | null;
  reviewNotes: string | null;
  reviewDueAt: string | null;
  reviewedAt: string | null;
}

export interface ProjectCreateDTO {
  name: string;
  description: string;
  objectives: string;
  beneficiaryPopulations: string;
  budget: number;
  startAt: string;
  endAt: string;
}

export interface ProjectVotingResult {
  projectId: number;
  projectName: string;
  description: string;
  objectives: string;
  beneficiaryPopulations: string;
  budget: number;
  projectStartAt: string;
  projectEndAt: string;
  votingStartAt: string;
  votingEndAt: string;
  closedAt: string;
  votesInFavor: number;
  votesAgainst: number;
  totalVotes: number;
  approvalPercentage: number;
  finalResult: string;
}
