import {
  FilePenLine,
  Clock,
  Eye,
  NotebookPen,
  ListChecks,
  LaptopMinimalCheck,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { ProjectStatus } from "@/shared/types/projectTypes";

export const PROJECT_STATUS_FILTERS: {
  label: string;
  value: ProjectStatus | "all";
  icon?: LucideIcon;
}[] = [
  { label: "Todos", value: "all" },

  { label: "Borrador", value: "DRAFT", icon: FilePenLine },

  { label: "Pendiente de revisión", value: "PENDING_REVIEW", icon: Clock },

  { label: "En revisión", value: "IN_REVIEW", icon: Eye },

  {
    label: "Con observaciones",
    value: "RETURNED_WITH_OBSERVATIONS",
    icon: NotebookPen,
  },

  {
    label: "Listo para publicar",
    value: "READY_TO_PUBLISH",
    icon: ListChecks,
  },

  { label: "Publicado", value: "PUBLISHED", icon: LaptopMinimalCheck },

  { label: "Rechazado", value: "REJECTED", icon: XCircle },

  { label: "Votación cerrada", value: "VOTING_CLOSED", icon: CheckCircle2 },
];
