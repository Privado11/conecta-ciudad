import { useContext } from "react";
import { VotingContext } from "@/context/VotingContext";

export function useVoting() {
  const context = useContext(VotingContext);

  if (!context) {
    throw new Error("useVoting debe usarse dentro de un <VotingProvider>");
  }

  return context;
}
