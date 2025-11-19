import { Calendar, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectDto } from "@/shared/types/projectTypes";
import { TimelineItem } from "./TimelineItem";


interface TimelineSectionProps {
  project: ProjectDto;
}

export function TimelineSection({ project }: TimelineSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
          <CalendarDays className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Cronograma
        </h3>
      </div>
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <TimelineItem
              label="Inicio del Proyecto"
              date={project.startAt}
              icon={Calendar}
              isActive={true}
            />
            <TimelineItem
              label="Fin del Proyecto"
              date={project.endAt}
              icon={Calendar}
            />
            <TimelineItem
              label="Inicio de Votación"
              date={project.votingStartAt}
              icon={Calendar}
            />
            <TimelineItem
              label="Fin de Votación"
              date={project.votingEndAt}
              icon={Calendar}
            />
            <TimelineItem
              label="Fecha de Creación"
              date={project.createdAt}
              icon={Calendar}
            />
            <TimelineItem
              label="Última Actualización"
              date={project.updatedAt}
              icon={Clock}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};