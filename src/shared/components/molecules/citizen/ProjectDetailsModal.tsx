import { useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  FileText,
  ChevronDown,
  Vote,
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
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { VotingButtons } from "../../atoms/citizen/VotingButtons";
import { formatDate } from "@/utils/formatDate";
import type { ProjectVotingDto } from "@/shared/types/projectTypes";

type ProjectDetailsModalProps = {
  project: ProjectVotingDto | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (projectId: number, decision: boolean) => void;
};

export function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
  onVote,
}: ProjectDetailsModalProps) {
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
          {project.userVotingStatus.hasVoted ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 text-center">
              {"Ya votaste en este proyecto"}
            </div>
          ) : (
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Vote className="w-5 h-5" />
                  Emitir Voto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VotingButtons projectId={project.id} onVote={onVote} />
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
                <div
                  className={`
      overflow-hidden transition-all duration-300
      ${isDescriptionOpen ? "max-h-[600px]" : "max-h-[70px]"}
    `}
                >
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

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
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Ejecución del Proyecto
                </p>
                <div className="flex items-center gap-2 text-gray-900">
                  <span>{formatDate(project.startAt)}</span>
                  <span className="text-gray-400">—</span>
                  <span>{formatDate(project.endAt)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Período de Votación
                </p>
                <div className="flex items-center gap-2 text-gray-900">
                  <span>{formatDate(project.votingStartAt)}</span>
                  <span className="text-gray-400">—</span>
                  <span>{formatDate(project.votingEndAt)}</span>
                </div>
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
