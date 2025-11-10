import {
  UserCog,
  Users,
  FolderDot,
  KeySquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { ActionResult, ActionType, EntityType } from "@/shared/types/auditTypes";

export const ACTION_TYPE_FILTERS: {
  label: string;
  value: ActionType | "all";
  icon?: React.ElementType;
}[] = [
  { label: "Todas las entidades", value: "all" },
  { label: "Usuarios", value: "USER", icon: Users },
  { label: "Proyectos", value: "PROJECT", icon: FolderDot },
];

export const ACTION_RESULT_FILTERS: {
  label: string;
  value: ActionResult | "all";
  icon?: React.ElementType;
}[] = [
  { label: "Todas", value: "all" },
  { label: "Exitosas", value: "SUCCESS", icon: CheckCircle },
  { label: "Fallidas", value: "FAILED", icon: XCircle },
];

export const ACTION_ENTITY_FILTERS: {
  label: string;
  value: EntityType | "all";
  icon?: React.ElementType;
}[] = [
  { label: "Todas las entidades", value: "all" },
  { label: "Usuarios", value: "USER", icon: Users },
  { label: "Proyectos", value: "PROJECT", icon: FolderDot },
  { label: "Roles", value: "ROLE", icon: UserCog },
  { label: "Accesos", value: "ACCESS", icon: KeySquare },
];
