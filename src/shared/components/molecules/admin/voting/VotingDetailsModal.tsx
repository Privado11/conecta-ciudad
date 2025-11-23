import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  Target,
  UsersRound,
  FileText,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatDate";
import { Progress } from "@/components/ui/progress";

interface VotingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VotingProjectDto | null;
}

export function VotingDetailsModal({
  isOpen,
  onClose,
  project,
}: VotingDetailsModalProps) {
  if (!project) return null;

  const isVotingOpen = project.votingStatus === "OPEN";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                {project.name}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {isVotingOpen ? (
                  <>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      <Clock className="w-3 h-3 mr-1" />
                      Votación Abierta
                    </Badge>
                    {project.urgencyLevel &&
                      project.urgencyLevel !== "NORMAL" && (
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
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Estado de Votación
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <ThumbsUp className="w-8 h-8 text-green-600" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Votos a favor
                    </span>
                    <span className="text-2xl font-bold text-green-700">
                      {project.votesInFavor.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <ThumbsDown className="w-8 h-8 text-red-600" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Votos en contra
                    </span>
                    <span className="text-2xl font-bold text-red-700">
                      {project.votesAgainst.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progreso de Aprobación</span>
                  <span className="text-muted-foreground">
                    {approvalPercentage.toFixed(1)}% a favor
                  </span>
                </div>
                <Progress value={approvalPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Participación
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-700">
                    {project.participationRate.toFixed(1)}%
                  </span>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      Total de Votos
                    </span>
                  </div>
                  <span className="text-xl font-bold text-purple-700">
                    {project.totalVotes.toLocaleString()}
                  </span>
                </div>
              </div>

              {isVotingOpen && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-900">
                      {getTimeRemainingText()}
                    </span>
                  </div>
                </div>
              )}

              {!isVotingOpen && project.closedAt && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Cerrada el {formatDate(project.closedAt)}
                      </span>
                    </div>
                    {project.approvalPercentage !== undefined && (
                      <span className="text-sm font-semibold">
                        {project.approvalPercentage.toFixed(1)}% de aprobación
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información del Proyecto
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Descripción
                  </label>
                  <p className="mt-1 text-sm">{project.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Objetivos
                  </label>
                  <p className="mt-1 text-sm">{project.objectives}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UsersRound className="w-4 h-4" />
                    Población Beneficiaria
                  </label>
                  <p className="mt-1 text-sm">
                    {project.beneficiaryPopulations}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalles del Proyecto</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Presupuesto
                  </label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(project.budget)}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Creador
                  </label>
                  <p className="text-lg font-semibold">
                    {project.creator.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.creator.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Inicio del Proyecto
                  </label>
                  <p className="text-sm">{formatDate(project.startAt)}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fin del Proyecto
                  </label>
                  <p className="text-sm">{formatDate(project.endAt)}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Inicio de Votación
                  </label>
                  <p className="text-sm">{formatDate(project.votingStartAt)}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fin de Votación
                  </label>
                  <p className="text-sm">{formatDate(project.votingEndAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
