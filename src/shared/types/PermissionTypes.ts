import type { UserRole } from "./userTYpes";

export interface Role {
  id: number;
  name: UserRole;
  permissions: Permission[];
}

export type PermissionCode =
  | "USER_VIEW"
  | "USER_CREATE"
  | "USER_UPDATE"
  | "USER_DELETE"
  | "USER_ROLE_ASSIGN"
  | "USER_ROLE_REMOVE"
  | "USER_TOGGLE_STATUS"
  | "USER_IMPORT"
  | "USER_EXPORT"
  | "USER_EXPORT_ALL"
  | "USER_PROFILE_UPDATE"
  | "USER_PROFILE_DELETE"
  | "ROLE_VIEW"
  | "ROLE_CREATE"
  | "ROLE_UPDATE"
  | "ROLE_DELETE"
  | "ROLE_PERMISSION_UPDATE"
  | "ROLE_PERMISSION_ADD"
  | "ROLE_PERMISSION_REMOVE"
  | "PROJECT_CREATE"
  | "PROJECT_VIEW"
  | "PROJECT_VIEW_ALL"
  | "PROJECT_VIEW_MINE"
  | "PROJECT_UPDATE"
  | "PROJECT_ASSIGN_CURATOR"
  | "PROJECT_ADD_OBSERVATIONS"
  | "PROJECT_APPROVE"
  | "PROJECT_VIEW_ASSIGNED"
  | "PROJECT_DELETE"
  | "PROJECT_VIEW_READY_TO_PUBLISH"
  | "AUDIT_VIEW"
  | "AUDIT_DETAIL_VIEW"
  | "CITIZEN_ACTION_CREATE"
  | "CITIZEN_ACTION_VIEW";

export interface Permission {
  id: number;
  code: PermissionCode;
  description: string;
  isCritical: boolean;
}

export interface PermissionGroup {
  module: string;
  permissions: PermissionCode[];
}

export type LoadingRoleState = {
  fetchingRoles: boolean;
  fetchingPermissions: boolean;
  fetchingRole: boolean;
  updatingRole: boolean;
};
