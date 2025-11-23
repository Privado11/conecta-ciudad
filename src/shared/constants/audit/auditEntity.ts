import type { EntityType } from "@/shared/types/auditTypes";

export const ENTITY_BADGE_CONFIG: Record<
  EntityType,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  USER: { label: "Usuarios", variant: "outline" },
  PROJECT: { label: "Proyectos", variant: "outline" },
  REVIEW: { label: "Revisiones", variant: "outline" },
  ACCESS: { label: "Accesos", variant: "outline" },
};
