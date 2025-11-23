import { FileText, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectDto } from "@/shared/types/projectTypes";

interface GeneralInfoSectionProps {
  project: ProjectDto;
}

export function GeneralInfoSection({ project }: GeneralInfoSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Información General
        </h3>
      </div>
      <div className="space-y-3">
        <Card className="border-l-4 border-l-slate-700 dark:border-l-slate-400 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="pt-5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Descripción del Proyecto
            </label>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.description || "Sin descripción registrada."}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-600 dark:border-l-slate-400 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="pt-5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Objetivos del Proyecto
            </label>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.objectives}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-500 dark:border-l-slate-400 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="pt-5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Poblaciones Beneficiarias
            </label>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.beneficiaryPopulations}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-300 dark:border-slate-700">
          <CardContent className="pt-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0">
                <DollarSign className="w-6 h-6 text-slate-700 dark:text-slate-200" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Presupuesto
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  ${project.budget.toLocaleString("es-ES")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
