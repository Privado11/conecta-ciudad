import type { ProjectStatus } from "@/shared/types/projectTypes";

export const PROJECT_STATUS_BADGE_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  DRAFT: {
    label: "Borrador",
    variant: "secondary",
  },

  PENDING_REVIEW: {
    label: "Pendiente de revisión",
    variant: "outline",
  },

  IN_REVIEW: {
    label: "En revisión",
    variant: "outline",
  },

  RETURNED_WITH_OBSERVATIONS: {
    label: "Con observaciones",
    variant: "destructive",
  },

  READY_TO_PUBLISH: {
    label: "Listo para publicar",
    variant: "default",
  },

  PUBLISHED: {
    label: "Publicado",
    variant: "default",
  },

  REJECTED: {
    label: "Rechazado",
    variant: "destructive",
  },

  OPEN_FOR_VOTING: {
    label: "Abierto para votación",
    variant: "default",
  },

  VOTING_CLOSED: {
    label: "Votación cerrada",
    variant: "secondary",
  },
};
