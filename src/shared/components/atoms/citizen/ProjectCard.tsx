import {
  Eye,
  FileText,
  Users,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VotingButtons } from "./VotingButtons";
import type { ProjectVotingDto } from "@/shared/types/projectTypes";
import { formatDate } from "@/utils/formatDate";

type ProjectCardProps = {
  project: ProjectVotingDto;
  onViewDetails: (project: ProjectVotingDto) => void;
  onVote: (projectId: number, decision: boolean) => void;
  loading: boolean;
};

const getUrgencyBadge = (urgencyLevel: string, daysRemaining: number) => {
  if (urgencyLevel === "CRITICAL") {
    if (daysRemaining === 0) {
      return {
        text: "Vence hoy",
        className: "bg-red-100 text-red-700 border-red-300",
      };
    }
    return {
      text: "Vence mañana",
      className: "bg-red-100 text-red-700 border-red-300",
    };
  }
  if (urgencyLevel === "HIGH") {
    return {
      text: `Vence en ${daysRemaining} días`,
      className: "bg-orange-100 text-orange-700 border-orange-300",
    };
  }
  return null;
};


export function ProjectCard({
  project,
  onViewDetails,
  onVote,
  loading,
}: ProjectCardProps) {
  const urgencyBadge = getUrgencyBadge(
    project.votingInfo.urgencyLevel,
    project.votingInfo.daysRemaining
  );

  const { hasVoted } = project.userVotingStatus;

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="text-lg leading-tight">
            {project.name}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap min-h-[28px]">
            {urgencyBadge && (
              <Badge
                variant="outline"
                className={`text-xs ${urgencyBadge.className}`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {urgencyBadge.text}
              </Badge>
            )}
            {hasVoted && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-100 text-blue-700 border-blue-300"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Ya votaste
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Período de votación</span>
          </div>
          <div className="text-sm text-gray-600">
            <span>{formatDate(project.votingStartAt)}</span>
            <span className="mx-2">—</span>
            <span>{formatDate(project.votingEndAt)}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">Objetivos</span>
            </div>
            <p className="text-gray-600 line-clamp-2 pl-6">
              {project.objectives}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">Beneficiarios</span>
            </div>
            <p className="text-gray-600 line-clamp-2 pl-6">
              {project.beneficiaryPopulations}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">Presupuesto</span>
            </div>
            <p className="font-semibold text-gray-900 pl-6">
              ${project.budget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex-1"></div>

        <Separator />

        {hasVoted ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 text-center">
            {"Ya votaste en este proyecto"}
          </div>
        ) : (
          <VotingButtons projectId={project.id} onVote={onVote} loading={loading}/>
        )}

        <Button
          onClick={() => onViewDetails(project)}
          variant="outline"
          className="w-full gap-2 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          Ver detalles completos
        </Button>
      </CardContent>
    </Card>
  );
}