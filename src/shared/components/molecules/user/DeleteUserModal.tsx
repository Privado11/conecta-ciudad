import { Button } from "@/components/ui/button";
import { Modal } from "../../atoms/Modal";
import { Loader2 } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  userName: string | undefined;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteUserModal({
  isOpen,
  userName,
  onClose,
  onConfirm,
  loading,
}: DeleteUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar eliminación"
      width="sm"
    >
      <p className="text-sm text-muted-foreground mb-6 px-6">
        ¿Estás seguro de que deseas eliminar a <strong>{userName}</strong>?
      </p>
      <p className="text-sm text-muted-foreground mb-6 px-6">
        Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose} className="cursor-pointer">
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          className="cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Eliminando
            </>
          ) : (
            "Eliminar"
          )}
        </Button>
      </div>
    </Modal>
  );
}
