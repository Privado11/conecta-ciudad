import {
  UserCog,
  Users,
  FolderDot,
  KeySquare,
  CheckCircle,
  XCircle,
  type LucideIcon,
  UserPlus,
  User,
  UserMinus,
  Upload,
  Download,
  ArrowUpDown,
  FileCheck,
  ClipboardList,
  Repeat,
  Vote,
  MessageSquareText,
} from "lucide-react";
import type {
  ActionResult,
  ActionType,
  EntityType,
} from "@/shared/types/auditTypes";

export const ACTION_BY_ENTITY: Record<
  EntityType | "all",
  { label: string; value: ActionType | "all"; icon?: LucideIcon }[]
> = {
  all: [{ label: "Todas las acciones", value: "all" }],

  USER: [
    { label: "Todas", value: "all" },
    { label: "Creación", value: "USER_CREATED", icon: UserPlus },
    { label: "Actualización", value: "USER_UPDATED", icon: User },
    { label: "Eliminación", value: "USER_DELETED", icon: UserMinus },
    { label: "Activación", value: "USER_ACTIVATED", icon: CheckCircle },
    { label: "Desactivación", value: "USER_DEACTIVATED", icon: XCircle },
    { label: "Login exitoso", value: "USER_LOGIN", icon: KeySquare },
    { label: "Login fallido", value: "USER_LOGIN_FAILED", icon: XCircle },
    { label: "Importación", value: "USER_BULK_IMPORT", icon: Upload },
    { label: "Exportación", value: "USER_EXPORT", icon: Download },
  ],

  PROJECT: [
    { label: "Todas", value: "all" },
    { label: "Creación", value: "PROJECT_CREATED", icon: FolderDot },
    { label: "Actualización", value: "PROJECT_UPDATED", icon: ArrowUpDown },
    { label: "Aprobación", value: "PROJECT_APPROVED", icon: FileCheck },
    { label: "Voto ciudadano", value: "CITIZEN_VOTE", icon: Vote },
    { label: "Comentario", value: "CITIZEN_COMMENT", icon: MessageSquareText },
  ],

  REVIEW: [
    { label: "Todas", value: "all" },
    { label: "Curador asignado", value: "CURATOR_ASSIGNED", icon: UserCog },
    { label: "Curador reasignado", value: "CURATOR_REASSIGNED", icon: Repeat },
    {
      label: "Observaciones",
      value: "PROJECT_OBSERVATIONS_ADDED",
      icon: ClipboardList,
    },
  ],

  ACCESS: [
    { label: "Todas", value: "all" },
    { label: "Login exitoso", value: "USER_LOGIN", icon: KeySquare },
    { label: "Login fallido", value: "USER_LOGIN_FAILED", icon: XCircle },
  ],
};

export const ACTION_RESULT_FILTERS: {
  label: string;
  value: ActionResult | "all";
  icon?: LucideIcon;
}[] = [
  { label: "Todas", value: "all" },
  { label: "Exitosas", value: "SUCCESS", icon: CheckCircle },
  { label: "Fallidas", value: "FAILED", icon: XCircle },
];

export const ACTION_ENTITY_FILTERS: {
  label: string;
  value: EntityType | "all";
  icon?: LucideIcon;
}[] = [
  { label: "Todas las entidades", value: "all" },
  { label: "Usuarios", value: "USER", icon: Users },
  { label: "Proyectos", value: "PROJECT", icon: FolderDot },
  { label: "Revisiones", value: "REVIEW", icon: ClipboardList },
  { label: "Accesos", value: "ACCESS", icon: KeySquare },
];
