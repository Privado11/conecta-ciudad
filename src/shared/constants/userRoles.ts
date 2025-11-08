import type { UserRole } from "@/shared/types/userTYpes";
export const ROLE_BADGE_CONFIG: Record<
  UserRole,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  ADMIN: { label: "Administrador", variant: "outline" },
  LIDER_COMUNITARIO: { label: "Líder Comunitario", variant: "outline" },
  CURATOR: { label: "Curador", variant: "outline" },
  CIUDADANO: { label: "Ciudadano", variant: "outline" },
};

export const USER_ROLES = {
ADMIN: "Administrador",
LIDER_COMUNITARIO: "Líder Comunitario",
CURATOR: "Curador",
CIUDADANO: "Ciudadano",
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: "Acceso completo a todas las funciones del sistema",
  LIDER_COMUNITARIO: "Puede crear y administrar proyectos comunitarios",
  CURATOR: "Puede gestionar y aprobar proyectos comunitarios",
  CIUDADANO: "Puede participar, votar e interactuar con los proyectos comunitarios",
};


