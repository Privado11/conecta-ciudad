import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, History} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CuratorQuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Proyectos Pendientes',
      icon: FolderKanban,
      onClick: () => navigate('/curator/review/pending'),
      variant: 'default' as const,
    },
    {
      label: 'Historial de Revisiones',
      icon: History,
      onClick: () => navigate('/curator/review/history'),
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              onClick={action.onClick}
              className="h-auto py-4 flex flex-col items-center gap-2 cursor-pointer"
            >
              <action.icon className="h-6 w-6" />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
