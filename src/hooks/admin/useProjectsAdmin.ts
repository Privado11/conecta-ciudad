import { useAdminProjectsStore } from "@/stores/admin/adminProjectsStore";

export const useProjectsAdmin = () => {
  return useAdminProjectsStore();
};
