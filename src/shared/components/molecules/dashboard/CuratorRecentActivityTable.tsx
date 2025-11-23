import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CuratorRecentActivity } from '@/shared/types/curatorTypes';

interface CuratorRecentActivityTableProps {
  data: CuratorRecentActivity[];
}

export function CuratorRecentActivityTable({ data }: CuratorRecentActivityTableProps) {
  const getOutcomeBadgeVariant = (outcome: string) => {
    switch (outcome) {
      case 'APROBADO':
        return 'default';
      case 'DEVUELTO':
        return 'secondary';
      case 'EN_REVISION':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    switch (outcome) {
      case 'APROBADO':
        return 'Aprobado';
      case 'DEVUELTO':
        return 'Devuelto';
      case 'EN_REVISION':
        return 'En Revisión';
      default:
        return outcome;
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Mi Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No hay actividad reciente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Mi Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.projectName}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-4">
                <Badge variant={getOutcomeBadgeVariant(activity.outcome)}>
                  {getOutcomeLabel(activity.outcome)}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
