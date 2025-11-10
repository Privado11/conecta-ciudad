import type { User } from "./userTYpes";

export type ActionResult = "SUCCESS" | "FAILED" | "PARTIAL";

export type EntityType = 
  | "USER" 
  | "PROJECT" 
  | "REVIEW" 
  | "ROLE" 
  | "ACCESS" 
  | "SYSTEM";

export type ActionType = 
  | "PROJECT" 
  | "USER" 
  | "CITIZEN";
  

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




