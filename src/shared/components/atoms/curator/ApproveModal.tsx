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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  DollarSign,
  X,
  Calendar,
  Info,
  BadgeCheckIcon,
} from "lucide-react";
import type { PendingReviewDto } from "@/shared/types/curatorTypes";

interface ApproveModalProps {
  project: PendingReviewDto | null;
  isOpen: boolean;
  onClose: () => void;

  onApprove: (dates: { votingStartAt: string; votingEndAt: string }) => void;
  loading: boolean;
}

export function ApproveModal({
  project,
  isOpen,
  onClose,
  onApprove,
  loading,
}: ApproveModalProps) {
  const [votingDates, setVotingDates] = useState({
    votingStartAt: "",
    votingEndAt: "",
  });

  if (!project) return null;

  const handleSubmit = () => {
    if (!votingDates.votingStartAt || !votingDates.votingEndAt) return;

    onApprove(votingDates);
    setVotingDates({ votingStartAt: "", votingEndAt: "" });
  };

  const handleClose = () => {
    if (loading) return;
    setVotingDates({ votingStartAt: "", votingEndAt: "" });
    onClose();
  };

  const isValidDateRange = () => {
    if (!votingDates.votingStartAt || !votingDates.votingEndAt) return true;
    return (
      new Date(votingDates.votingStartAt) < new Date(votingDates.votingEndAt)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <BadgeCheckIcon className="w-5 h-5 text-green-600" />
            Aprobar Proyecto para Votación
          </DialogTitle>
          <DialogDescription>
            Define el período de votación. El proyecto será publicado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="border-green-200 bg-green-50/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">
                {project.projectName}
              </h3>

              <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                <strong className="font-medium text-neutral-800">
                  Descripción:{" "}
                </strong>
                {project.description
                  ? project.description
                  : "Sin descripción registrada."}
              </p>

              <p className="text-sm text-muted-foreground mb-4">
                <strong className="font-medium text-neutral-800">
                  Objetivos:{" "}
                </strong>
                {project.objectives}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{project.creatorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              Una vez aprobado, el proyecto será visible y no podrá editarse.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Período de Votación
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Inicio *</Label>
                <Input
                  type="date"
                  value={votingDates.votingStartAt}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setVotingDates((prev) => ({
                      ...prev,
                      votingStartAt: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de Fin *</Label>
                <Input
                  type="date"
                  value={votingDates.votingEndAt}
                  min={
                    votingDates.votingStartAt ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setVotingDates((prev) => ({
                      ...prev,
                      votingEndAt: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {!isValidDateRange() && (
              <p className="text-sm text-destructive">
                La fecha de fin debe ser posterior a la fecha de inicio.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="cursor-pointer"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              !votingDates.votingStartAt ||
              !votingDates.votingEndAt ||
              !isValidDateRange()
            }
            className="cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Procesando...
              </div>
            ) : (
              <>
                <BadgeCheckIcon className="w-4 h-4 mr-2" />
                Aprobar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
