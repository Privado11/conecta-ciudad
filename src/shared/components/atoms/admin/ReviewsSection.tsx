import { Eye, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectDto } from "@/shared/types/projectTypes";
import { ReviewCard } from "./ReviewCard";


interface ReviewsSectionProps {
  project: ProjectDto;
  completedReviews: number;
  totalReviews: number;
}

export function ReviewsSection({
  project,
  completedReviews,
  totalReviews,
}: ReviewsSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <Eye className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Proceso de Revisión
          </h3>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-semibold border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          {completedReviews}/{totalReviews}
        </Badge>
      </div>
      {project.reviews && project.reviews.length > 0 ? (
        <div className="space-y-4">
          {project.reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              isLatest={index === project.reviews.length - 1}
            />
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-full w-fit mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Sin revisiones asignadas
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Este proyecto aún no tiene curadores asignados
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};