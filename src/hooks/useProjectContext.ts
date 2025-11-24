import { useContext } from "react";
import { ProjectContext } from "@/context/ProjectContext";

export function useProjectContext() {
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error("useProjectContext debe usarse dentro de un <ProjectProvider>");
    }

    return context;
}
