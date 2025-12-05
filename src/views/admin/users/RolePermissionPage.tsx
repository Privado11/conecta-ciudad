import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSION_GROUPS } from "@/shared/constants/permission/permissions";
import { Loader2, ShieldCheck } from "lucide-react";
import type {
  Permission,
  PermissionCode,
  Role,
} from "@/shared/types/PermissionTypes";
import { RoleSelector } from "@/shared/components/atoms/RoleSelector";
import { PermissionTabs } from "@/shared/components/atoms/PermissionTabs";
import { EmptyState } from "@/shared/components/atoms/EmptyState";

export default function RolePermissionPage() {
  const {
    roles,
    permissions,
    selectedRole,
    setSelectedRole,
    loading,
    fetchRoles,
    fetchPermissions,
    getRoleById,
    updateRolePermissions,
  } = usePermission();

  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());
  const [localPermissions, setLocalPermissions] = useState<Set<string>>(
    new Set()
  );
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    fetchRoles?.();
    fetchPermissions?.();
  }, []);

  useEffect(() => {
    if (!activeTab && Object.keys(PERMISSION_GROUPS).length > 0) {
      setActiveTab(Object.keys(PERMISSION_GROUPS)[0]);
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedRole) {
      const codes = new Set(
        selectedRole.permissions.map((p: Permission) => p.code)
      );
      setLocalPermissions(codes);
      setPendingChanges(new Set());
    }
  }, [selectedRole]);

  const handleRoleChange = (role: Role | null) => {
    if (role) {
      setSelectedRole(role);
      setActiveTab(Object.keys(PERMISSION_GROUPS)[0]);
      getRoleById?.(role.id);
    }
  };

  const handleToggle = (code: string, checked: boolean) => {
    const updated = new Set(localPermissions);
    checked ? updated.add(code) : updated.delete(code);
    setLocalPermissions(updated);

    const originallyHadPermission = selectedRole?.permissions.some(
      (p: Permission) => p.code === code
    );
    const nowHasPermission = updated.has(code);

    const newPending = new Set(pendingChanges);

    if (originallyHadPermission !== nowHasPermission) {
      newPending.add(code);
    } else {
      newPending.delete(code);
    }

    setPendingChanges(newPending);
  };

  const handleSaveChanges = async () => {
    if (!selectedRole || pendingChanges.size === 0) return;

    const updatedCodes = Array.from(localPermissions);

    await updateRolePermissions?.(selectedRole.id, updatedCodes);

    setPendingChanges(new Set());
  };

  const handleCancelChanges = () => {
    if (selectedRole) {
      const codes = new Set(
        selectedRole.permissions.map((p: Permission) => p.code)
      );
      setLocalPermissions(codes);
      setPendingChanges(new Set());
    }
  };

  const getModuleStats = (codes: PermissionCode[]) => {
    const selected = codes.filter((c) => localPermissions.has(c)).length;
    return { selected, total: codes.length };
  };

  const toggleModulePermissions = (codes: PermissionCode[]) => {
    const stats = getModuleStats(codes);
    const allSelected = stats.selected === stats.total;

    const updated = new Set(localPermissions);
    const pending = new Set(pendingChanges);

    codes.forEach((code) => {
      allSelected ? updated.delete(code) : updated.add(code);
      pending.add(code);
    });

    setLocalPermissions(updated);
    setPendingChanges(pending);
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Gestión de Roles y Permisos</h2>
          <p className="text-sm text-muted-foreground">
            Configura los permisos para cada rol del sistema
          </p>
        </div>
      </div>

      <RoleSelector
        roles={roles}
        selectedRole={selectedRole}
        pendingChanges={pendingChanges}
        loading={loading.updatingRole}
        onRoleChange={handleRoleChange}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
      />

      {loading.fetchingPermissions && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in-50">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
          <p className="text-sm animate-pulse">Cargando información…</p>
        </div>
      )}

      {selectedRole && !loading.fetchingPermissions && (
        <Card>
          <CardContent className="p-6">
            <PermissionTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              getModuleStats={getModuleStats}
              localPermissions={localPermissions}
              pendingChanges={pendingChanges}
              permissions={permissions}
              onToggle={handleToggle}
              onToggleModule={toggleModulePermissions}
              disabled={loading.updatingRole}
            />
          </CardContent>
        </Card>
      )}

      {!selectedRole && !loading.fetchingRoles && <EmptyState />}
    </div>
  );
}
