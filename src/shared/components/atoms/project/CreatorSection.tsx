import { User, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ProjectDto } from "@/shared/types/projectTypes";
import { getInitials } from "@/utils/projectUtils";


interface CreatorSectionProps {
  project: ProjectDto;
}

export function CreatorSection({ project }: CreatorSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
          <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Creador
        </h3>
      </div>
      <Card className="bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-slate-200 dark:ring-slate-700 shrink-0">
              <AvatarFallback className="bg-slate-600 dark:bg-slate-500 text-white font-bold text-lg">
                {getInitials(project.creator.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-white text-lg">
                {project.creator.name}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{project.creator.email}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};