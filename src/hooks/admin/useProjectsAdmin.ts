import { useContext } from "react";
import { AdminProjectsContext } from "@/context/AdminProjectsContext";

export function useProjectsAdmin() {
  const context = useContext(AdminProjectsContext);

  if (!context) {
    throw new Error(
      "useProjectsAdmin debe usarse dentro de un <AdminProjectsProvider>"
    );
  }

  return context;
}
