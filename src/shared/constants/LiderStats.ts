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
    label: "Pendientes",
    icon: UserCheck,
    color: "text-green-500",
    valueKey: "pendiente",
  },
  {
    label: "En revision",
    icon: UserCheck,
    color: "text-green-500",
    valueKey: "enRevision",
  },
  {
    label: "Devuelto",
    icon: UserX,
    color: "text-red-500",
    valueKey: "devuelto",
  },
  {
    label: "Publicado",
    icon: UserX,
    color: "text-yellow-500",
    valueKey: "publicado",
  },
  {
    label: "Listo para publicar",
    icon: UserX,
    color: "text-purple-500",
    valueKey: "listoParaPublicar",
  },
];

export const PROJECT_STATUS_FILTERS: {
  label: string;
  value: ProjectStatus | "all";
  icon?: React.ElementType;
}[] = [
  { label: "Todos", value: "all" },
  { label: "En revision", value: "EN_REVISION", icon: UserCheck },
  { label: "Publicado", value: "PUBLICADO", icon: UserX },
  { label: "Devuelto", value: "DEVUELTO", icon: UserX },
  { label: "Pendiente", value: "PENDIENTE", icon: UserX },
  { label: "Listo para publicar", value: "LISTO_PARA_PUBLICAR", icon: UserCheck },
];

