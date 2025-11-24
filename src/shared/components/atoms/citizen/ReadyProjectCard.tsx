import { Eye, FileText, Users, DollarSign, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ProjectReadyDto } from "@/shared/types/projectTypes";

type ReadyProjectCardProps = {
  project: ProjectReadyDto;
  onViewDetails: (project: ProjectReadyDto) => void;
};


export function ReadyProjectCard({ project, onViewDetails }: ReadyProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            Pendiente de publicación
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {project.votingSchedule.hasScheduledVoting ? (
          <div className="border rounded-lg p-3 bg-blue-50 space-y-2">
            <div className="flex items-center gap-2 text-blue-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Votación programada</span>
            </div>
            <div className="text-sm text-blue-900 space-y-1">
              <p>
                Inicia en <span className="font-semibold">{project.votingSchedule.daysUntilVotingStarts} días</span>
              </p>
              <p className="text-xs text-blue-700">
                Duración: {project.votingSchedule.plannedVotingDurationDays} días
              </p>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-3 bg-amber-50 space-y-2">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Sin votación programada</span>
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">Objetivos</span>
            </div>
            <p className="text-gray-600 line-clamp-2 pl-6">{project.objectives}</p>
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

        <Separator />

        <div className="text-xs text-gray-500">
          Creado por <span className="font-medium text-gray-700">{project.creator.name}</span>
        </div>

        <Button onClick={() => onViewDetails(project)} variant="outline" className="w-full gap-2 cursor-pointer">
          <Eye className="w-4 h-4" />
          Ver detalles completos
        </Button>
      </CardContent>
    </Card>
  );
}
