import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  User,
  Calendar,
  DollarSign,
  MessageSquare,
  Eye,
  Users,
  BadgeCheck,
  ChevronDown,
  FileText,
} from "lucide-react";
import type { PendingReviewDto } from "@/shared/types/curatorTypes";
import { getBadgeColor } from "@/shared/constants/curator/priorityColors";

interface ProjectDetailsModalProps {
  project: PendingReviewDto | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenObservations: () => void;
  onOpenApprove: () => void;
}

export function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
  onOpenObservations,
  onOpenApprove,
}: ProjectDetailsModalProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto py-8">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">
                {project.projectName}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {project.objectives}
              </DialogDescription>
            </div>
            <Badge className={getBadgeColor(project.priorityLevel)}>
              {project.priorityLevel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {project.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
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
                      className={`text-sm text-muted-foreground ${
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
                        className="w-full hover:bg-transparent hover:text-current  hover:underline cursor-pointer"
                      >
                        {isDescriptionOpen ? (
                          <>
                            Ver menos
                            <ChevronDown className="w-4 h-4 ml-2 rotate-180 transition-transform" />
                          </>
                          ) : (
                            <>
                              Ver más
                              <ChevronDown className="w-4 h-4 ml-2 transition-transform" />
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                </Collapsible>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Información del Creador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Nombre</span>
                  <p className="font-medium">{project.creatorName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <p className="font-medium">{project.creatorEmail}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">ID</span>
                  <p className="font-medium">{project.creatorId}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fechas del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Inicio</span>
                  <p className="font-medium">
                    {new Date(project.projectStartAt).toLocaleDateString(
                      "es-ES"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fin</span>
                  <p className="font-medium">
                    {new Date(project.projectEndAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Días en revisión
                  </span>
                  <p className="font-medium">{project.daysInReview} días</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Presupuesto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${project.budget.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Beneficiarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{project.beneficiaryPopulations}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Estado de Revisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asignado:</span>
                <span className="font-medium">
                  {new Date(project.assignedAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vence:</span>
                <span className="font-medium">
                  {new Date(project.dueAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-semibold">{project.statusMessage}</span>
              </div>
              {project.isResubmission && (
                <div className="pt-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    Reenvío
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onOpenObservations}
            className="w-full sm:w-auto cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Devolver con Observaciones
          </Button>
          <Button
            onClick={onOpenApprove}
            className="w-full sm:w-auto cursor-pointer"
          >
            <BadgeCheck className="w-4 h-4 mr-2 " />
            Aprobar Proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}