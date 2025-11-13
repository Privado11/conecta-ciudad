import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PERMISSION_GROUPS } from "@/shared/constants/permission/permissions";
import { PermissionModule } from "./PermissionModule";
import type { PermissionCode } from "@/shared/types/PermissionTypes";

interface PermissionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  getModuleStats: (codes: PermissionCode[]) => {
    selected: number;
    total: number;
  };
  localPermissions: Set<string>;
  pendingChanges: Set<string>;
  permissions: any[];
  onToggle: (code: string, checked: boolean) => void;
  onToggleModule: (codes: PermissionCode[]) => void;
  disabled: boolean;
}

export function PermissionTabs({
  activeTab,
  onTabChange,
  getModuleStats,
  localPermissions,
  pendingChanges,
  permissions,
  onToggle,
  onToggleModule,
  disabled,
}: PermissionTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="flex w-full">
        {Object.entries(PERMISSION_GROUPS).map(([module, codes]) => {
          const stats = getModuleStats(codes);

          return (
            <TabsTrigger
              key={module}
              value={module}
              className="
              flex flex-col items-center py-3 cursor-pointer
              transition-colors hover:bg-muted hover:text-primary
              group
            "
            >
              <span className="flex items-center gap-2 group-hover:text-primary">
                {module}
                <span className="text-xs text-muted-foreground group-hover:text-primary">
                  {stats.selected}/{stats.total}
                </span>
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {Object.entries(PERMISSION_GROUPS).map(([module, codes]) => {
        const stats = getModuleStats(codes);

        return (
          <TabsContent key={module} value={module}>
            <PermissionModule
              module={module}
              codes={codes}
              stats={stats}
              localPermissions={localPermissions}
              pendingChanges={pendingChanges}
              permissions={permissions}
              onToggle={onToggle}
              onToggleAll={() => onToggleModule(codes)}
              disabled={disabled}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
