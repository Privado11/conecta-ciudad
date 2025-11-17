import { Eye, Edit, Trash2, UserPlus } from "lucide-react";
import type { DynamicTableConfig } from "@/shared/types/dynamicTableTypes";
import type { ProjectDto } from "@/shared/types/projectTypes";
import { PROJECT_STATUS_BADGE_CONFIG } from "@/shared/constants/project/projectStatus";
import { projectPermissions } from "@/shared/permissions/projectPermissions";

interface ProjectTableActions {
  onViewDetails: (project: ProjectDto) => void;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
  onAssignCurator: (project: ProjectDto) => void;
}

export const createProjectTableConfig = (
  actions: ProjectTableActions
): DynamicTableConfig<ProjectDto> => ({
  rowKey: "id",
  emptyMessage: "No se encontraron proyectos.",
  loadingMessage: "Cargando proyectos...",
  loadingFilterMessage: "Actualizando proyectos...",

  columns: [
    {
      key: "name",
      label: "Nombre del Proyecto",
      type: "text",
      sortable: true,
      className: "font-medium",
    },
    {
      key: "status",
      label: "Estado",
      type: "badge",
      sortable: true,
      badgeConfig: (project) => {
        const status = project.status;
        return PROJECT_STATUS_BADGE_CONFIG[status];
      },
    },
    {
      key: "creator",
      label: "Creador",
      type: "custom",
      sortable: true,
      render: (project) => (
        <div>
          <p className="font-medium text-sm">{project.creator.name}</p>
          <p className="text-xs text-muted-foreground">
            {project.creator.email}
          </p>
        </div>
      ),
    },
    {
      key: "curator",
      label: "Curador",
      type: "custom",
      render: (project) => {
        if (!project.reviews || project.reviews.length === 0) {
          return (
            <span className="text-xs text-muted-foreground italic">
              Sin asignar
            </span>
          );
        }

        const lastReview = project.reviews[project.reviews.length - 1];

        if (!lastReview?.curator) {
          return (
            <span className="text-xs text-muted-foreground italic">
              Sin asignar
            </span>
          );
        }

        return (
          <div>
            <p className="font-medium text-sm">{lastReview.curator.name}</p>
            <p className="text-xs text-muted-foreground">
              {lastReview.curator.email}
            </p>
          </div>
        );
      },
    },
    {
      key: "budget",
      label: "Presupuesto",
      type: "number",
      sortable: true,
      format: (value) =>
        value ? `$ ${Number(value).toLocaleString()}` : "N/A",
      className: "text-sm",
    },
    {
      key: "startAt",
      label: "Fecha Inicio",
      type: "date",
      sortable: true,
      format: (date) => {
        return new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      className: "text-sm text-muted-foreground",
    },
    {
      key: "endAt",
      label: "Fecha Fin",
      type: "date",
      sortable: true,
      format: (date) => {
        return new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      className: "text-sm text-muted-foreground",
    },
    {
      key: "createdAt",
      label: "Creado",
      type: "date",
      sortable: true,
      format: (date) => {
        return new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      className: "text-sm text-muted-foreground",
    },
  ],

  actions: [
    {
      label: "Ver detalles",
      icon: <Eye className="w-4 h-4 mr-2" />,
      onClick: actions.onViewDetails,
      className:
        "transition-colors data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700 dark:data-[highlighted]:bg-blue-900/30 dark:data-[highlighted]:text-blue-400",
    },
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4 mr-2" />,
      onClick: actions.onEdit,
      hidden: (project) => !projectPermissions.canEdit(project.status),
      className:
        "transition-colors data-[highlighted]:bg-green-100 data-[highlighted]:text-green-700 dark:data-[highlighted]:bg-green-900/30 dark:data-[highlighted]:text-green-400",
    },
    {
      label: (project) => {
        const hasCurator =
          project.reviews &&
          project.reviews.length > 0 &&
          project.reviews[project.reviews.length - 1]?.curator;
        return hasCurator ? "Reasignar curador" : "Asignar curador";
      },
      icon: <UserPlus className="w-4 h-4 mr-2" />,
      onClick: actions.onAssignCurator,
      hidden: (project) =>
        !projectPermissions.canReassignCurator(project.status),
      className:
        "transition-colors data-[highlighted]:bg-purple-100 data-[highlighted]:text-purple-700 dark:data-[highlighted]:bg-purple-900/30 dark:data-[highlighted]:text-purple-400",
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: actions.onDelete,
      className:
        "text-destructive transition-colors data-[highlighted]:bg-red-100 data-[highlighted]:text-red-700 dark:data-[highlighted]:bg-red-900/30 dark:data-[highlighted]:text-red-400",
    },
  ],
});
