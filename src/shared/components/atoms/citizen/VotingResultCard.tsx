import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { VotingProjectDto } from "@/shared/types/votingTypes";
import {
  Calendar,
  DollarSign,
  ThumbsDown,
  ThumbsUp,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatDate";

interface VotingResultCardProps {
  project: VotingProjectDto;
  onViewDetails: (project: VotingProjectDto) => void;
}

export function VotingResultCard({
  project,
  onViewDetails,
}: VotingResultCardProps) {
  const hasResults =
    project.totalVotes !== null &&
    project.votesInFavor !== null &&
    project.votesAgainst !== null;

  const approvalPercentage =
    hasResults && project.totalVotes! > 0
      ? (project.votesInFavor! / project.totalVotes!) * 100
      : 0;

  const isApproved = project.finalResult === "APPROVED";

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
          <div>
            {hasResults && project.finalResult ? (
              isApproved ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Aprobado
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  <XCircle className="w-3 h-3 mr-1" />
                  Rechazado
                </Badge>
              )
            ) : (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                En Votación
              </Badge>
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

        {hasResults ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Resultado de Votación</span>
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
                    {project.votesInFavor!.toLocaleString()}
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
                    {project.votesAgainst!.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Cerrada el {formatDate(project.votingEndAt!)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de votos:</span>
                <span className="font-semibold">
                  {project.totalVotes!.toLocaleString()}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Votación en curso
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Los resultados finales se mostrarán cuando cierre la votación
                </p>
              </div>
            </div>
            {project.votingEndAt && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">
                    Cierra el {formatDate(project.votingEndAt)}
                  </span>
                </div>
              </div>
            )}
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
