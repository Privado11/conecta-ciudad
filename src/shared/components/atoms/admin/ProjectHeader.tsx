import { FileText, Eye } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ProjectDto } from "@/shared/types/projectTypes";
import { PROJECT_STATUS_BADGE_CONFIG } from "@/shared/constants/project/projectStatus";

interface ProjectHeaderProps {
  project: ProjectDto;
  completedReviews: number;
  totalReviews: number;
}

export function ProjectHeader({
  project,
  completedReviews,
  totalReviews,
}: ProjectHeaderProps) {
  const statusConfig = PROJECT_STATUS_BADGE_CONFIG[project.status] || {
    label: project.status,
    variant: "outline",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-linear-to-br from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 rounded-lg shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-white mb-3 text-balance">
            {project.name}
          </DialogTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={statusConfig.variant}
              className="font-semibold text-xs "
            >
              {statusConfig.label}
            </Badge>
            <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              v{project.version}
            </span>
            <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>
                {completedReviews}/{totalReviews} revisiones
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
