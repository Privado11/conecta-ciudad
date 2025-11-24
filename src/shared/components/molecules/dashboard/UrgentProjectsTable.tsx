import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UrgentProjectData } from '@/shared/types/curatorTypes';
import { AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UrgentProjectsTableProps {
  data: UrgentProjectData[];
}

export function UrgentProjectsTable({ data }: UrgentProjectsTableProps) {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRÍTICA':
        return 'destructive';
      case 'ALTA':
        return 'default';
      case 'MEDIA':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getDaysColor = (daysUntilDue: number, isOverdue: boolean) => {
    if (isOverdue) return 'text-destructive';
    if (daysUntilDue <= 2) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Proyectos Urgentes Pendientes de Revisión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No hay proyectos urgentes pendientes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Proyectos Urgentes Pendientes de Revisión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((project) => (
            <div 
              key={project.projectId} 
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{project.projectName}</h4>
                  <Badge variant={getPriorityColor(project.priorityLevel)}>
                    {project.priorityLevel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Creador: {project.creatorName}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    En revisión: {project.daysInReview} días
                  </span>
                  <span className={getDaysColor(project.daysUntilDue, project.isOverdue)}>
                    {project.isOverdue 
                      ? `Vencido hace ${Math.abs(project.daysUntilDue)} día(s)` 
                      : `Vence en ${project.daysUntilDue} día(s)`
                    }
                  </span>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => navigate(`/curator/review/pending`)}
                className='cursor-pointer'
              >
                Revisar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
