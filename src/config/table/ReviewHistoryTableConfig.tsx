import { Eye } from "lucide-react";
import type { DynamicTableConfig } from "@/shared/types/dynamicTableTypes";
import type { ReviewHistoryDto } from "@/shared/types/curatorTypes";
import { Badge } from "@/components/ui/badge";

interface ReviewHistoryTableActions {
  onViewDetails: (review: ReviewHistoryDto) => void;
}

export const createReviewHistoryTableConfig = (
  actions: ReviewHistoryTableActions
): DynamicTableConfig<ReviewHistoryDto> => ({
  rowKey: "reviewId",
  emptyMessage: "No se encontraron revisiones en el historial",
  loadingMessage: "Cargando historial...",
  loadingFilterMessage: "Actualizando resultados...",

  columns: [
    {
      key: "projectName",
      label: "Proyecto",
      type: "custom",
      sortable: true,
      render: (review) => (
        <div>
          <p className="font-medium text-sm">{review.projectName}</p>
          <p className="text-xs text-muted-foreground">
            {review.creatorName}
          </p>
        </div>
      ),
    },
    {
      key: "reviewedAt",
      label: "Fecha de Revisión",
      type: "date",
      sortable: true,
      format: (date) =>
        new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      className: "text-sm",
    },
    {
      key: "projectStatus",
      label: "Resultado",
      type: "custom",
      sortable: false,
      render: (review) => {
        const outcome =
          review.projectStatus === "READY_TO_PUBLISH" ||
          review.projectStatus === "OPEN_FOR_VOTING" ||
          review.projectStatus === "VOTING_CLOSED"
            ? "APROBADO"
            : review.projectStatus === "RETURNED_WITH_OBSERVATIONS"
            ? "DEVUELTO"
            : "RECHAZADO";

        const colorMap = {
          APROBADO: "bg-green-100 text-green-700 hover:bg-green-100",
          DEVUELTO: "bg-amber-100 text-amber-700 hover:bg-amber-100",
          RECHAZADO: "bg-red-100 text-red-700 hover:bg-red-100",
        };

        return (
          <Badge className={colorMap[outcome as keyof typeof colorMap]}>
            {outcome}
          </Badge>
        );
      },
    },
    {
      key: "daysToComplete",
      label: "Tiempo",
      type: "custom",
      sortable: true,
      render: (review) => (
        <div className="text-sm space-y-1">
          <span className="font-medium">{review.daysToComplete} días</span>
          <div className="flex gap-1">
            {review.wasOverdue && (
              <Badge variant="destructive" className="text-xs">
                Tarde
              </Badge>
            )}
            {review.isResubmission && (
              <Badge
                variant="secondary"
                className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-100"
              >
                Reenvío
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "budget",
      label: "Presupuesto",
      type: "number",
      sortable: true,
      format: (value) =>
        value ? `$ ${Number(value).toLocaleString()}` : "N/A",
      className: "font-medium text-sm",
    },
    {
      key: "assignedAt",
      label: "Asignado",
      type: "date",
      sortable: true,
      format: (date) =>
        new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
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
  ],
});