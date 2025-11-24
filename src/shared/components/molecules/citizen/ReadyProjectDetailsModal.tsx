import { useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  FileText,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ProjectReadyDto } from "@/shared/types/projectTypes";
import { formatDate } from "@/utils/formatDate";

type ReadyProjectDetailsModalProps = {
  project: ProjectReadyDto | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ReadyProjectDetailsModal({
  project,
  isOpen,
  onClose,
}: ReadyProjectDetailsModalProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <DialogDescription className="mt-2 text-base">
            {project.objectives}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {project.votingSchedule.hasScheduledVoting ? (
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Votación Programada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inicia en:</span>
                  <span className="font-semibold text-blue-700">
                    {project.votingSchedule.daysUntilVotingStarts} días
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium text-gray-900">
                    {project.votingSchedule.plannedVotingDurationDays} días
                  </span>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Período de votación
                  </p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{formatDate(project.votingStartAt!)}</span>
                    <span className="text-gray-400">—</span>
                    <span>{formatDate(project.votingEndAt!)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Sin Votación Programada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-900">
                  {project.votingSchedule.scheduleStatus}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Descripción del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Collapsible
                open={isDescriptionOpen}
                onOpenChange={setIsDescriptionOpen}
              >
                <div className="space-y-2">
                  <p
                    className={`text-gray-700 leading-relaxed ${
                      !isDescriptionOpen ? "line-clamp-3" : ""
                    }`}
                  >
                    {project.description}
                  </p>
                  {project.description.length > 150 && (
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 hover:bg-transparent hover:text-inherit"
                      >
                        <span className="flex items-center justify-center hover:underline hover:decoration-1 cursor-pointer">
                          {isDescriptionOpen ? (
                            <>
                              Ver menos
                              <ChevronDown className="w-4 h-4 ml-2 rotate-180" />
                            </>
                          ) : (
                            <>
                              Ver más
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </span>
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
              </Collapsible>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Presupuesto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  ${project.budget.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Población Beneficiaria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {project.beneficiaryPopulations}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cronograma de Ejecución
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-gray-900">
                <span>{formatDate(project.startAt)}</span>
                <span className="text-gray-400">—</span>
                <span>{formatDate(project.endAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-5 h-5" />
                Responsable del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium text-gray-900">
                  {project.creator.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Correo electrónico</p>
                <p className="font-medium text-gray-900">
                  {project.creator.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
