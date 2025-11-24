import { useContext } from "react";
import { AdminUsersContext } from "@/context/AdminUsersContext";

export function useUsersAdmin() {
  const context = useContext(AdminUsersContext);

  if (!context) {
    throw new Error("useUsersAdmin debe usarse dentro de un <AdminUsersProvider>");
  }

  return context;
}
