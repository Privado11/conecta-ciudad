import { Button } from "@/components/ui/button";
import { PermissionItem } from "./PermissionItem";
import type { PermissionCode } from "@/shared/types/PermissionTypes";

interface PermissionModuleProps {
  module: string;
  codes: PermissionCode[];
  stats: { selected: number; total: number };
  localPermissions: Set<string>;
  pendingChanges: Set<string>;
  permissions: any[];
  onToggle: (code: string, checked: boolean) => void;
  onToggleAll: () => void;
  disabled: boolean;
}

export function PermissionModule({
  module,
  codes,
  stats,
  localPermissions,
  pendingChanges,
  permissions,
  onToggle,
  onToggleAll,
  disabled,
}: PermissionModuleProps) {
  const allSelected = stats.selected === stats.total;
  const someSelected = stats.selected > 0 && stats.selected < stats.total;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">{module}</h3>
          <span className="text-sm text-muted-foreground">
            {stats.selected} de {stats.total} permisos seleccionados
          </span>
        </div>
        <Button
          variant={
            allSelected ? "secondary" : someSelected ? "outline" : "ghost"
          }
          size="sm"
          onClick={onToggleAll}
          disabled={disabled}
          className="cursor-pointer"
        >
          {allSelected ? "Quitar todos" : "Seleccionar todos"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {codes.map((code) => {
          const perm = permissions?.find((p) => p.code === code);
          const isChecked = localPermissions.has(code);
          const isPending = pendingChanges.has(code);

          

          return (
            <PermissionItem
              key={code}
              code={code}
              isChecked={isChecked}
              isPending={isPending}
              onToggle={(checked) => onToggle(code, checked)}
              disabled={disabled}
              permission={perm}
            />
          );
        })}
      </div>
    </div>
  );
}
