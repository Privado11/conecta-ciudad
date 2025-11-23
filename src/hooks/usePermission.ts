import { useContext } from "react";
import { PermissionContext } from "@/context/PermissionContext";

export function usePermission() {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error("usePermission debe usarse dentro de un <PermissionProvider>");
  }

  return context;
}
