import type { ProjectStatus } from "@/shared/types/projectTypes";

export const projectPermissions = {
  canEdit: (status: ProjectStatus) =>
    status === "DRAFT" || status === "RETURNED_WITH_OBSERVATIONS",

  canSubmit: (status: ProjectStatus) =>
    status === "DRAFT" || status === "RETURNED_WITH_OBSERVATIONS",

  canAddObservations: (status: ProjectStatus) => 
    status === "IN_REVIEW" || status === "PENDING_REVIEW",

  canApprove: (status: ProjectStatus) => 
    status === "IN_REVIEW" || status === "PENDING_REVIEW",

  canReassignCurator: (status: ProjectStatus) =>
    status === "PENDING_REVIEW" || status === "IN_REVIEW",

  canPublish: (status: ProjectStatus) => 
    status === "READY_TO_PUBLISH",
};
