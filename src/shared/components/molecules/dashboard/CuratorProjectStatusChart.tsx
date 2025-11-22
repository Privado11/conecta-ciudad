import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CuratorProjectStatusData } from '@/shared/types/curatorTypes';

const statusLabels: Record<string, string> = {
  PENDING_REVIEW: 'Pendiente Revisión',
  IN_REVIEW: 'En Revisión',
  READY_TO_PUBLISH: 'Aprobados',
  PUBLISHED: 'Publicado',
  RETURNED_WITH_OBSERVATIONS: 'Devuelto con Observaciones',
};

interface CuratorProjectStatusChartProps {
  data: CuratorProjectStatusData[];
}

export function CuratorProjectStatusChart({ data }: CuratorProjectStatusChartProps) {
  const chartData = data.map(item => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    color: item.color,
  }));

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle>Mis Proyectos por Estado</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No hay datos disponibles
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Mis Proyectos por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} debounce={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
