import { UserCog, UserCheck, UserX } from "lucide-react";
import type { UserRole, UserStatus } from "../types/userTYpes";


export const ROLE_FILTERS: {
  label: string;
  value: UserRole | "all";
  icon?: React.ElementType;
}[] = [
  { label: "Todos los roles", value: "all" },
  { label: "Admin", value: "ADMIN", icon: UserCog },
  { label: "Líder", value: "LIDER_COMUNITARIO", icon: UserCheck },
  { label: "Curador", value: "CURATOR" },
  { label: "Ciudadano", value: "CIUDADANO" },
];

export const STATUS_FILTERS: {
  label: string;
  value: UserStatus | "all";
  icon?: React.ElementType;
}[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active", icon: UserCheck },
  { label: "Inactivos", value: "inactive", icon: UserX },
];
