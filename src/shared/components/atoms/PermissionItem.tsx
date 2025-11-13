import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PERMISSION_LABELS } from "@/shared/constants/permission/permissions";
import type { PermissionCode } from "@/shared/types/PermissionTypes";

interface PermissionItemProps {
  code: PermissionCode;
  isChecked: boolean;
  isPending: boolean;
  onToggle: (checked: boolean) => void;
  disabled: boolean;
  permission: any;
}

export function PermissionItem({
  code,
  isChecked,
  isPending,
  onToggle,
  disabled,
  permission,
}: PermissionItemProps) {
  const handleContainerClick = () => {
    if (!disabled) onToggle(!isChecked);
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`flex justify-between items-center p-3 rounded-lg border transition-colors cursor-pointer ${
        isChecked
          ? "bg-primary/5 border-primary/20"
          : "hover:bg-muted border-transparent"
      } ${isPending ? "ring-2 ring-primary/30" : ""}`}
    >
      <div className="flex-1 min-w-0 mr-3 cursor-pointer">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">
            {PERMISSION_LABELS[code as PermissionCode] || code}
          </p>

          {permission?.isCritical && (
            <Badge variant="destructive" className="py-0">
              crítico
            </Badge>
          )}
        </div>

        {permission?.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {permission.description}
          </p>
        )}
      </div>

      <Switch
        checked={isChecked}
        disabled={disabled}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="cursor-pointer"
      />
    </div>
  );
}
