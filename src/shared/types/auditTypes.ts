export type ActionResult = "SUCCESS" | "FAILED" | "PARTIAL";

export type EntityType = 
  | "USER" 
  | "PROJECT" 
  | "REVIEW" 
  | "ROLE" 
  | "ACCESS" 
  | "SYSTEM";

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
  userId: number;
  accessId: number | null;
}


export interface PagedAuditResponse {
  content: ActionDto[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
