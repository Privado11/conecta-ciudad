import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  DollarSign,
  MessageSquare,
  AlertCircle,
  Send,
  X,
} from "lucide-react";
import type { PendingReviewDto } from "@/shared/types/curatorTypes";

interface ObservationsModalProps {
  project: PendingReviewDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectId: number, notes: string) => void;
  loading: boolean;
}

export function ObservationsModal({
  project,
  isOpen,
  onClose,
  onSubmit,
  loading,
}: ObservationsModalProps) {
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setObservations("");
    }
  }, [isOpen]);

  if (!project) return null;



  const handleSubmit = () => {
    if (observations.trim()) {
      onSubmit(project.projectId, observations);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg border border-neutral-300 bg-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-neutral-800">
            <MessageSquare className="w-5 h-5 text-neutral-600" />
            Devolver con Observaciones
          </DialogTitle>

          <DialogDescription className="text-sm text-neutral-500">
            Envía tus comentarios al creador para que realice los ajustes
            necesarios.
          </DialogDescription>
        </DialogHeader>

        <Card className="border border-neutral-300 bg-neutral-50 rounded-lg shadow-sm">
          <CardContent className="pt-6 space-y-3">
            <h3 className="font-medium text-lg text-neutral-800">
              {project.projectName}
            </h3>

            <p className="text-sm text-neutral-600">{project.objectives}</p>

            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-700">{project.creatorName}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-700">
                  ${project.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {project.currentNotes && (
          <Alert className="border border-neutral-300 bg-neutral-100 rounded-lg shadow-sm">
            <AlertCircle className="h-4 w-4 text-neutral-600" />
            <AlertDescription className="text-sm text-neutral-700">
              <strong>Nota anterior:</strong> {project.currentNotes}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 mt-4">
          <div>
            <h4 className="font-medium text-neutral-800 mb-1">
              Observaciones *
            </h4>
            <p className="text-sm text-neutral-500">
              Explica detalladamente qué debe corregir el creador.
            </p>
          </div>

          <Textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ejemplo: El presupuesto no especifica los costos de materiales..."
            rows={8}
            className="resize-none rounded-lg border-neutral-300 focus-visible:ring-neutral-700"
          />

          <p className="text-xs text-neutral-500 text-right">
            {observations.length} / 1000 caracteres
          </p>
        </div>

        <DialogFooter className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!observations.trim()}
            className="rounded-lg cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Enviando...
              </div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Observaciones
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
