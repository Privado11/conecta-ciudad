import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VotingHistoryDto } from "@/shared/types/votingTypes";
import {
  Calendar,
  ThumbsDown,
  ThumbsUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/utils/formatDate";

interface VotingHistoryCardProps {
  project: VotingHistoryDto;
  onViewDetails: (project: VotingHistoryDto) => void;
}

export function VotingHistoryCard({
  project,
  onViewDetails,
}: VotingHistoryCardProps) {
  // Adapter para manejar tanto VotingHistoryDto como la respuesta actual del backend
  const projectData = project as any;
  const projectName = project.projectName || projectData.name || "Sin nombre";
  const projectDescription =
    project.projectDescription || projectData.description || "Sin descripción";
  const voteDecision = project.voteDecision ?? projectData.voteDecision ?? true;

  const isInFavor = voteDecision;
  const isClosed = project.votingStatus === "CLOSED";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              {projectName}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {projectDescription}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {isClosed &&
              project.finalResult &&
              (project.finalResult === "APPROVED" ? (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Aprobado
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                  <XCircle className="w-3 h-3 mr-1" />
                  Rechazado
                </Badge>
              ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xs truncate">
              Inicio:{" "}
              {formatDate(project.votingStartAt || projectData.votingStartAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {isClosed ? "Cerrada" : "Abierta"}
            </span>
          </div>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">Tu voto</span>
            <span className="text-xs text-purple-700">
              {formatDateTime(
                project.voteDate ||
                  projectData.createdAt ||
                  new Date().toISOString()
              )}
            </span>
          </div>
        </div>

        {isClosed ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">A favor</span>
                  <span className="font-semibold text-green-700">
                    {project.votesInFavor?.toLocaleString() ?? 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    En contra
                  </span>
                  <span className="font-semibold text-red-700">
                    {project.votesAgainst?.toLocaleString() ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Cerrada el{" "}
                    {formatDate(project.votingEndAt || projectData.votingEndAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total de votos:</span>
                  <span className="font-semibold">
                    {project.totalVotes?.toLocaleString() ?? 0}
                  </span>
                </div>
                {project.approvalPercentage !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Aprobación:</span>
                    <span className="font-semibold text-blue-600">
                      {project.approvalPercentage.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="pt-2 border-t">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Votación en curso
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Los resultados se mostrarán cuando cierre la votación el{" "}
                    {formatDate(project.votingEndAt || projectData.votingEndAt)}
                  </p>
                </div>
              </div>
              {project.totalVotes !== null && project.totalVotes > 0 && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Votos actuales:</span>
                    <span className="font-semibold text-blue-900">
                      {project.totalVotes.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
