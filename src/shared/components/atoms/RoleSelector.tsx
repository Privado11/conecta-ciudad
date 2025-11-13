import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Role } from "@/shared/types/PermissionTypes";
import { USER_ROLES } from "@/shared/constants/user/userRoles";

interface RoleSelectorProps {
    roles: Role[];
    selectedRole: Role | null;
    pendingChanges: Set<string>;
    loading: boolean;
    onRoleChange: (role: Role | null) => void;
    onSave: () => void;
    onCancel: () => void;
  }
  

  export function RoleSelector({
    roles,
    selectedRole,
    pendingChanges,
    loading,
    onRoleChange,
    onSave,
    onCancel,
  }: RoleSelectorProps) {
    return (
      <div className="flex items-center gap-4">
        <Select
          value={selectedRole ? String(selectedRole.id) : undefined}
          onValueChange={(value) => {
            const role = roles.find((r) => String(r.id) === value) || null;
            onRoleChange(role);
          }}
          disabled={loading}

        >
          <SelectTrigger className="w-64 cursor-pointer">
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
  
          <SelectContent>
            {roles?.map((r) => (
              <SelectItem
                key={r.id}
                value={String(r.id)}
                className="cursor-pointer"
              >
                {USER_ROLES[r.name]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  
        {selectedRole && pendingChanges.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {pendingChanges.size} cambios pendientes
            </span>
  
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
  
            <Button size="sm" onClick={onSave} disabled={loading} className="cursor-pointer">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
  