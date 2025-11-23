import { useContext } from "react";
import { AuditContext } from "@/context/AuditContext";

export function useAudit() {
  const context = useContext(AuditContext);

  if (!context) {
    throw new Error("useAudit debe usarse dentro de un <AuditProvider>");
  }

  return context;
}
