import { Users, UserCheck, UserX } from "lucide-react";
import type { StatCardProps } from "@/shared/interface/LiderStats";
import type { ProjectStatus } from "../interface/Projects";

export const LIDER_STATS: StatCardProps[] = [
  {
    label: "Total Lideres",
    icon: Users,
    color: "text-blue-500",
    valueKey: "total",
  },
  {
    label: "Borrador",
    icon: UserCheck,
    color: "text-gray-500",
    valueKey: "draft",
  },
  {
    label: "En revisión",
    icon: UserCheck,
    color: "text-yellow-500",
    valueKey: "inReview",
  },
  {
    label: "Devuelto",
    icon: UserX,
    color: "text-red-500",
    valueKey: "returned",
  },
  {
    label: "Abierto a votación",
    icon: UserCheck,
    color: "text-green-500",
    valueKey: "openForVoting",
  },
  {
    label: "Votación cerrada",
    icon: UserX,
    color: "text-purple-500",
    valueKey: "votingClosed",
  },
];

export const PROJECT_STATUS_FILTERS: {
  label: string;
  value: ProjectStatus | "all";
  icon?: React.ElementType;
}[] = [
    { label: "Todos", value: "all" },
    { label: "Borrador", value: "DRAFT", icon: UserCheck },
    { label: "En revisión", value: "IN_REVIEW", icon: UserCheck },
    { label: "Devuelto", value: "RETURNED_WITH_OBSERVATIONS", icon: UserX },
    { label: "Abierto a votación", value: "OPEN_FOR_VOTING", icon: UserCheck },
    { label: "Votación cerrada", value: "VOTING_CLOSED", icon: UserX },
  ];

