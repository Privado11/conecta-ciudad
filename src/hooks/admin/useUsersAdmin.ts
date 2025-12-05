import { useAdminUsersStore } from "@/stores/admin/adminUsersStore";

export const useUsersAdmin = () => {
  return useAdminUsersStore();
};
