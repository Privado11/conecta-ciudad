import { useContext } from "react";
import { CuratorContext } from "@/context/CuratorContext";

export function useCurator() {
  const context = useContext(CuratorContext);

  if (!context) {
    throw new Error("useCurator debe usarse dentro de un <CuratorProvider>");
  }

  return context;
}
