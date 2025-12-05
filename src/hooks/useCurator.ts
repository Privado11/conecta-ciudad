import { useCuratorProjectStore } from "@/stores/curator/curatorProjectStore";
import { useCuratorDashboardStore } from "@/stores/curator/curatorDashboardStore";

export const useCurator = () => {
  const projectStore = useCuratorProjectStore();
  const dashboardStore = useCuratorDashboardStore();

  // Rename loading to avoid conflicts
  const { loading: projectLoading, ...restProjectStore } = projectStore;
  const { loading: dashboardLoading, ...restDashboardStore } = dashboardStore;

  return {
    ...restProjectStore,
    ...restDashboardStore,
    // Expose the project loading as the main loading (it has the structure components expect)
    loading: projectLoading as typeof projectLoading,
    dashboardLoading,
    projectLoading,
  };
};
