import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ProjectDto } from "@/shared/types/projectTypes";
import { ProjectHeader } from "../../../atoms/admin/ProjectHeader";
import { GeneralInfoSection } from "../../../atoms/admin/GeneralInfoSection";
import { TimelineSection } from "../../../atoms/admin/TimelineSection";
import { CreatorSection } from "../../../atoms/admin/CreatorSection";
import { ReviewsSection } from "../../../atoms/admin/ReviewsSection";
import { ProjectDetailsFooter } from "../../../atoms/admin/ProjectDetailsFooter";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDto | null;
  onEdit?: (project: ProjectDto) => void;
  onAssignCurator?: (project: ProjectDto) => void;
}

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  onEdit,
  onAssignCurator,
}: ProjectDetailsModalProps) {
  if (!project) return null;

  const latestReview =
    project.reviews && project.reviews.length > 0
      ? project.reviews[project.reviews.length - 1]
      : null;

  const totalReviews = project.reviews?.length || 0;
  const completedReviews =
    project.reviews?.filter((r) => r.reviewedAt)?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 bg-linear-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 flex flex-col overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 shrink-0 bg-linear-to-br from-white/80 via-slate-50/50 to-transparent backdrop-blur-sm ">
          <ProjectHeader
            project={project}
            completedReviews={completedReviews}
            totalReviews={totalReviews}
          />
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-8 py-8 space-y-8">
            <GeneralInfoSection project={project} />
            <Separator className="bg-linear-to-r from-transparent via-slate-300 to-transparent dark:from-transparent dark:via-slate-600 dark:to-transparent" />
            <TimelineSection project={project} />
            <Separator className="bg-linear-to-r from-transparent via-slate-300 to-transparent dark:from-transparent dark:via-slate-600 dark:to-transparent" />
            <CreatorSection project={project} />
            <Separator className="bg-linear-to-r from-transparent via-slate-300 to-transparent dark:from-transparent dark:via-slate-600 dark:to-transparent" />
            <ReviewsSection
              project={project}
              completedReviews={completedReviews}
              totalReviews={totalReviews}
            />
            <div className="h-4"></div>
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-slate-200/60 dark:border-slate-700/60 bg-linear-to-t from-white/90 via-slate-50/50 to-transparent dark:from-slate-900/90 dark:via-slate-800/50 backdrop-blur-sm">
          <ProjectDetailsFooter
            project={project}
            latestReview={latestReview}
            onEdit={onEdit}
            onAssignCurator={onAssignCurator}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
