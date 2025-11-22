import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  User,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
} from "lucide-react";
import type { ReviewHistoryDto } from "@/shared/types/curatorTypes";

interface ReviewHistoryDetailsModalProps {
  review: ReviewHistoryDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewHistoryDetailsModal({
  review,
  isOpen,
  onClose,
}: ReviewHistoryDetailsModalProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  if (!review) return null;

  const outcome = review.projectStatus === "READY_TO_PUBLISH"
    ? "APROBADO"
    : review.projectStatus === "RETURNED_WITH_OBSERVATIONS"
    ? "DEVUELTO"
    : "RECHAZADO";

  const outcomeColor = {
    APROBADO: "bg-green-100 text-green-700",
    DEVUELTO: "bg-amber-100 text-amber-700",
    RECHAZADO: "bg-red-100 text-red-700",
  }[outcome];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto py-8">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">
                {review.projectName}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {review.objectives}
              </DialogDescription>
            </div>
            <Badge className={outcomeColor}>{outcome}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Descripción del Proyecto */}
          {review.description && (
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
                      {review.description}
                    </p>
                    {review.description.length > 150 && (
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

          {/* Información del Creador */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Creador del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <p className="font-medium">{review.creatorName}</p>
              </div>
              {review.creatorEmail && (
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{review.creatorEmail}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información de la Revisión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fechas de Revisión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Asignado:</span>
                  <p className="font-medium">
                    {new Date(review.assignedAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Completado:</span>
                  <p className="font-medium">
                    {new Date(review.reviewedAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tiempo total:</span>
                  <p className="font-medium flex items-center gap-2">
                    {review.daysToComplete} días
                    {review.wasOverdue ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Completado tarde
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        A tiempo
                      </Badge>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Detalles del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Presupuesto:</span>
                  <p className="text-2xl font-bold">
                    ${review.budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Beneficiarios:</span>
                  <p className="font-medium">{review.beneficiaryPopulations}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Observaciones */}
          {review.notes && (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Observaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{review.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Fechas de Votación (si fue aprobado) */}
          {outcome === "APROBADO" && review.votingStartAt && review.votingEndAt && (
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Período de Votación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inicio:</span>
                  <span className="font-medium">
                    {new Date(review.votingStartAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fin:</span>
                  <span className="font-medium">
                    {new Date(review.votingEndAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Badges adicionales */}
          <div className="flex gap-2">
            {review.isResubmission && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Reenvío
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}