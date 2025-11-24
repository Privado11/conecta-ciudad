import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { VotingProjectDto } from "@/shared/types/votingTypes";
import {
  Calendar,
  Clock,
  DollarSign,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatDate";

interface VotingProjectCardProps {
  project: VotingProjectDto;
  onViewDetails: (project: VotingProjectDto) => void;
}

export function VotingProjectCard({
  project,
  onViewDetails,
}: VotingProjectCardProps) {
  const isOpen = project.votingStatus === "OPEN";
  const approvalPercentage =
    project.totalVotes > 0
      ? (project.votesInFavor / project.totalVotes) * 100
      : 0;


  const getUrgencyColor = (level?: string) => {
    switch (level) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "default";
      default:
        return "secondary";
    }
  };

  const getResultBadge = () => {
    if (project.finalResult === "APPROVED") {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Aprobado
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="w-3 h-3 mr-1" />
        Rechazado
      </Badge>
    );
  };

  const getTimeRemainingText = () => {
    if (!project.daysRemaining && !project.hoursRemaining) return "";

    if (project.daysRemaining && project.daysRemaining > 0) {
      return `${project.daysRemaining} día${
        project.daysRemaining > 1 ? "s" : ""
      } restantes`;
    }

    return `${project.hoursRemaining || 0} hora${
      (project.hoursRemaining || 0) > 1 ? "s" : ""
    } restantes`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {isOpen ? (
              <>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <Clock className="w-3 h-3 mr-1" />
                  Abierta
                </Badge>
                {project.urgencyLevel && project.urgencyLevel !== "NORMAL" && (
                  <Badge variant={getUrgencyColor(project.urgencyLevel)}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {project.urgencyLevel === "CRITICAL"
                      ? "Urgente"
                      : "Prioridad"}
                  </Badge>
                )}
              </>
            ) : (
              getResultBadge()
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {formatCurrency(project.budget)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {project.creator.name}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progreso de Votación</span>
            <span className="text-muted-foreground">
              {approvalPercentage.toFixed(1)}% a favor
            </span>
          </div>
          <Progress value={approvalPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <ThumbsUp className="w-4 h-4 text-green-600" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">A favor</span>
              <span className="font-semibold text-green-700">
                {project.votesInFavor.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
            <ThumbsDown className="w-4 h-4 text-red-600" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">En contra</span>
              <span className="font-semibold text-red-700">
                {project.votesAgainst.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Participación
            </span>
          </div>
          <span className="text-sm font-semibold text-blue-700">
            {project.participationRate.toFixed(1)}%
          </span>
        </div>

        <div className="pt-2 border-t">
          {isOpen ? (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {getTimeRemainingText()}
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Cerrada el {formatDate(project.votingEndAt!)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de votos:</span>
                <span className="font-semibold">
                  {project.totalVotes.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <Button
            onClick={() => onViewDetails(project)}
            variant="outline"
            className="w-full gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
