import { useAdminAuditStore } from "@/stores/admin/adminAuditStore";

export const useAudit = () => {
  return useAdminAuditStore();
};
