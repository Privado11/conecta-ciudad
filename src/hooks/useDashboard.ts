import { useAdminDashboardStore } from "@/stores/admin/adminDashboardStore";

export const useDashboard = () => {
  return useAdminDashboardStore();
};
