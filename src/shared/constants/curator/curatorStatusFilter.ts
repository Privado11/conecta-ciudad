import { Clock, CircleAlert, ClockAlert, CircleCheck } from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { ProjectPriority } from "@/shared/types/curatorTypes";

export const CURATOR_STATUS_FILTERS: {
  label: string;
  value: ProjectPriority | "all";
  icon?: LucideIcon;
}[] = [
  { label: "Todos", value: "all" },

  { label: "Crítica", value: "CRÍTICA", icon: CircleAlert },

  { label: "Alta", value: "ALTA", icon: ClockAlert },

  { label: "Media", value: "MEDIA", icon: Clock },

  {
    label: "Normal",
    value: "NORMAL",
    icon: CircleCheck,
  },
];
