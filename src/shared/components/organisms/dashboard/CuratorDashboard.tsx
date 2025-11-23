import { useEffect } from 'react';
import { useCurator } from '@/hooks/useCurator';

import { CuratorProjectStatusChart } from '@/shared/components/molecules/dashboard/CuratorProjectStatusChart';
import { ReviewTrendChart } from '@/shared/components/molecules/dashboard/ReviewTrendChart';
import { UrgentProjectsTable } from '@/shared/components/molecules/dashboard/UrgentProjectsTable';
import { CuratorRecentActivityTable } from '@/shared/components/molecules/dashboard/CuratorRecentActivityTable';
import { CuratorQuickActions } from '@/shared/components/molecules/dashboard/CuratorQuickActions';
import { FolderKanban, Clock, CheckCircle, AlertCircle, TrendingUp, Timer } from 'lucide-react';
import { StatCard } from '../../atoms/dashboard/StatCard';

export function CuratorDashboard() {
  const { 
    dashboardStats, 
    projectStatusData, 
    reviewTrendData, 
    urgentProjects, 
    recentActivities,
    fetchDashboardData,
    loading 
  } = useCurator();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading.fetchingDashboard && !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }


  if (!dashboardStats) {
    return null; 
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Curador</h1>
        <p className="text-muted-foreground">
          Gestiona tus revisiones de proyectos y mantén el control de tu carga de trabajo.
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Proyectos Asignados"
          value={dashboardStats.assignedProjects}
          icon={FolderKanban}
          description="Total bajo tu responsabilidad"
        />
        <StatCard
          title="Pendientes de Revisión"
          value={dashboardStats.pendingReview}
          icon={Clock}
          description={`${dashboardStats.overdueProjects} vencidos`}
        />
        <StatCard
          title="En Revisión"
          value={dashboardStats.inReview}
          icon={AlertCircle}
          description="Actualmente revisando"
        />
        <StatCard
          title="Completados Este Mes"
          value={dashboardStats.completedThisMonth}
          icon={CheckCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tiempo Promedio"
          value={`${dashboardStats.averageReviewTime} días`}
          icon={Timer}
          description="Por revisión"
        />
        <StatCard
          title="Tasa de Aprobación"
          value={`${dashboardStats.approvalRate}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="Puntualidad"
          value={`${dashboardStats.onTimeRate}%`}
          icon={CheckCircle}
          description="Completados a tiempo"
        />
        <StatCard
          title="Proyectos Vencidos"
          value={dashboardStats.overdueProjects}
          icon={AlertCircle}
          description="Requieren atención urgente"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CuratorProjectStatusChart data={projectStatusData} />
        <ReviewTrendChart data={reviewTrendData} />
      </div>

      <UrgentProjectsTable data={urgentProjects} />

      <CuratorQuickActions />


      <CuratorRecentActivityTable data={recentActivities} />
    </div>
  );
}
