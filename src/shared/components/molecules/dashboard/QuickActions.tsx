import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FolderKanban, Vote, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Crear Usuario',
      icon: UserPlus,
      onClick: () => navigate('/admin/users'),
      variant: 'default' as const,
    },
    {
      label: 'Ver Proyectos',
      icon: FolderKanban,
      onClick: () => navigate('/admin/projects'),
      variant: 'outline' as const,
    },
    {
      label: 'Votaciones Activas',
      icon: Vote,
      onClick: () => navigate('/admin/projects'), 
      variant: 'outline' as const,
    },
    {
      label: 'Auditoría',
      icon: FileText,
      onClick: () => navigate('/admin/audit'),
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
