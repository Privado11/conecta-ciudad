import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  variant?: "default" | "destructive";
  width?: "sm" | "md" | "lg" | "xl" ;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Confirmar acción",
  description = "¿Estás seguro de que deseas realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loadingText = "Procesando",
  variant = "default",
  width = "sm",
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width={width}>
      <div className="px-6 mb-6">
        {typeof description === "string" ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : (
          description
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={onClose}
          className="cursor-pointer"
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          className="cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingText}
            </>
          ) : (
            confirmText
          )}
        </Button>
      </div>
    </Modal>
  );
}

