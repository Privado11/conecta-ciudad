import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "../atoms/Modal";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/shared/types/userTYpes";
import {
  ROLE_BADGE_CONFIG,
  ROLE_DESCRIPTIONS,
} from "@/shared/constants/userRoles";
import { Loader2 } from "lucide-react";

interface ChangeRoleModalProps {
  isOpen: boolean;
  userName: string | undefined;
  currentRoles: UserRole[] | undefined;
  onClose: () => void;
  onConfirm: (newRole: UserRole) => void;
  loading: boolean;
}

export function ChangeRoleModal({
  isOpen,
  userName,
  currentRoles,
  onClose,
  onConfirm,
  loading,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm(selectedRole);
      setSelectedRole(null);
    }
  };

  const handleClose = () => {
    setSelectedRole(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar rol de usuario">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona el nuevo rol para <strong>{userName}</strong>
        </p>
        <div className="space-y-2">
          {(Object.keys(ROLE_BADGE_CONFIG) as UserRole[]).map((role) => {
            const badge = ROLE_BADGE_CONFIG[role];
            const isCurrentRole = currentRoles?.includes(role);
            const isSelected = selectedRole === role;

            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "w-full p-3 border rounded-lg text-left hover:bg-accent transition-colors",
                  isCurrentRole && "border-muted bg-muted/30",
                  isSelected &&
                    "border-primary bg-primary/10 ring-2 ring-primary/20"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{badge.label}</span>
                  {isCurrentRole && (
                    <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                      Rol actual
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {ROLE_DESCRIPTIONS[role]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={handleClose} className="cursor-pointer" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} disabled={!selectedRole || loading} className="cursor-pointer">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cambiando rol
            </>
          ) : (
            "Cambiar"
          )}
        </Button>
      </div>
    </Modal>
  );
}
