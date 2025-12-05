import { useAdminVotingStore } from "@/stores/admin/adminVotingStore";

export const useVoting = () => {
  return useAdminVotingStore();
};
