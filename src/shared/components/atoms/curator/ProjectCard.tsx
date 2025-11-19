import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, User, DollarSign, Eye } from "lucide-react";

import type { PendingReviewDto } from "@/shared/types/curatorTypes";
import {
  getBadgeColor,
  getStatusColor,
} from "@/shared/constants/curator/priorityColors";

interface ProjectCardProps {
  project: PendingReviewDto;
  onReview: (project: PendingReviewDto) => void;
}

export function ProjectCard({ project, onReview }: ProjectCardProps) {
  const daysLeft =
    project.daysUntilDue > 0 ? project.daysUntilDue - 1 : project.daysUntilDue;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{project.projectName}</h3>

              {project.isResubmission && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-100"
                >
                  Reenvío
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {project.objectives}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge className={getBadgeColor(project.priorityLevel)}>
              {project.priorityLevel}
            </Badge>

            <span
              className={`text-xs font-semibold ${getStatusColor(
                project.priorityLevel
              )}`}
            >
              {project.statusMessage}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{project.creatorName}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>${project.budget.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{project.daysInReview} días en revisión</span>
          </div>
        </div>

        {project.currentNotes && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertDescription className="text-sm text-amber-900">
              <strong>Nota anterior:</strong> {project.currentNotes}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <span>Vence:</span>{" "}
          <span className="font-medium text-foreground">
            {new Date(project.dueAt).toLocaleDateString("es-ES")}
          </span>
          {project.isOverdue && (
            <span className="ml-2 text-destructive font-semibold">
              ({Math.abs(project.daysUntilDue)} días de retraso)
            </span>
          )}
          {project.isDueSoon && !project.isOverdue && (
            <span className="ml-2 text-orange-600 font-semibold">
              ({daysLeft} días restantes)
            </span>
          )}
        </div>

        <Button onClick={() => onReview(project)} className="gap-2 cursor-pointer">
          <Eye className="w-4 h-4" />
          Revisar
        </Button>
      </CardFooter>
    </Card>
  );
}
