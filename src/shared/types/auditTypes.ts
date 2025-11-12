import type { User } from "./userTYpes";

export type ActionResult = "SUCCESS" | "FAILED" | "PARTIAL";

export type EntityType = "USER" | "PROJECT" | "REVIEW" | "ACCESS";

export type UserActionType =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "USER_ACTIVATED"
  | "USER_DEACTIVATED"
  | "USER_ROLE_ADDED"
  | "USER_ROLE_REMOVED"
  | "USER_LOGIN"
  | "USER_LOGIN_FAILED"
  | "USER_BULK_IMPORT"
  | "USER_EXPORT";

export type ProjectActionType =
  | "CURATOR_ASSIGNED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_OBSERVATIONS_ADDED"
  | "PROJECT_APPROVED"
  | "CURATOR_REASSIGNED";

export type CitizenActionType = "CITIZEN_VOTE" | "CITIZEN_COMMENT";

export type ActionType = UserActionType | ProjectActionType | CitizenActionType;

export interface Access {
  id: number;
  accessAt: string;
  user: User;
  ipAddress: string;
  userAgent: string;
  location: string;
  success: boolean;
}

export interface ActionDto {
  id: number;
  actionType: string;
  description: string;
  entityType: EntityType;
  entityId: number;
  result: ActionResult;
  metadata: string | null;
  ipAddress: string | null;
  actionAt: string;
  user: User;
  access: Access;
}

export interface ActionDetails {
  id: number;
  actionType: string;
  description: string;
  result: string;
  entityType: string;
  actionAt: string;
  ipAddress: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  metadata?: Record<string, any>;
  entityData?: Record<string, any>;
  changes?: Record<string, any>;
}
