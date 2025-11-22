
import { ProjectStatusChart } from '@/shared/components/molecules/dashboard/ProjectStatusChart';
import { ProjectTrendChart } from '@/shared/components/molecules/dashboard/ProjectTrendChart';
import { VotingActivityChart } from '@/shared/components/molecules/dashboard/VotingActivityChart';
import { RecentActivityTable } from '@/shared/components/molecules/dashboard/RecentActivityTable';
import { QuickActions } from '@/shared/components/molecules/dashboard/QuickActions';
import { useDashboard } from '@/hooks/useDashboard';
import { Users, FolderKanban, Vote, TrendingUp, UserPlus } from 'lucide-react';
import { StatCard } from '../../atoms/dashboard/StatCard';
import { useEffect } from 'react';

export function AdminDashboard() {
  const { stats, loading, error, refreshDashboard } = useDashboard();

  useEffect(() => {
  refreshDashboard(); 
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive text-lg">{error}</p>
          <p className="text-muted-foreground mt-2">Por favor, intenta recargar la página</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Administrador</h1>
        <p className="text-muted-foreground">
          Bienvenido a Conecta Ciudad. Aquí tienes un resumen de la actividad del sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          description={`${stats.activeUsers} activos`}
        />
        <StatCard
          title="Total Proyectos"
          value={stats.totalProjects}
          icon={FolderKanban}
        />
        <StatCard
          title="Votaciones Activas"
          value={stats.activeVotaciones}
          icon={Vote}
          description="En curso actualmente"
        />
        <StatCard
          title="Participación"
          value={`${stats.participationRate}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="Nuevos Usuarios"
          value={stats.newUsersThisMonth}
          icon={UserPlus}
          description="Este mes"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectStatusChart />
        <ProjectTrendChart />
      </div>


      <VotingActivityChart />

      <QuickActions />


      <RecentActivityTable />
    </div>
  );
}
