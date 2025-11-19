import { Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectDto, ReviewDto } from "@/shared/types/projectTypes";
import { projectPermissions } from "@/shared/permissions/projectPermissions";

interface ProjectDetailsFooterProps {
  project: ProjectDto;
  latestReview: ReviewDto | null;
  onEdit?: (project: ProjectDto) => void;
  onAssignCurator?: (project: ProjectDto) => void;
  onClose: () => void;
}

export function ProjectDetailsFooter({
  project,
  latestReview,
  onEdit,
  onAssignCurator,
  onClose,
}: ProjectDetailsFooterProps) {
  return (
    <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
      {onAssignCurator &&
        projectPermissions.canReassignCurator(project.status) && (
          <Button
            variant="outline"
            onClick={() => onAssignCurator(project)}
            className="cursor-pointer"
          >
            <Users className="w-4 h-4 mr-2" />
            {latestReview?.curator ? "Reasignar Curador" : "Asignar Curador"}
          </Button>
        )}
      {onEdit && projectPermissions.canEdit(project.status) && (
        <Button onClick={() => onEdit(project)} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Editar Proyecto
        </Button>
      )}
      <Button variant="ghost" onClick={onClose} className="cursor-pointer">
        Cerrar
      </Button>
    </div>
  );
}
