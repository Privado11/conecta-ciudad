import { useCitizenProjectStore } from "@/stores/citizen/citizenProjectStore";

export const useProjectContext = () => {
  return useCitizenProjectStore();
};
