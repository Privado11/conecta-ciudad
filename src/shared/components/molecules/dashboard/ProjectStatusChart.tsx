import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";

const statusLabels: Record<string, string> = {
  DRAFT: "Borrador",
  PENDING_REVIEW: "Pendiente Revisión",
  IN_REVIEW: "En Revisión",
  PUBLISHED: "Publicado",
  OPEN_FOR_VOTING: "Votación Abierta",
  VOTING_CLOSED: "Votación Cerrada",
  RETURNED_WITH_OBSERVATIONS: "Devuelto con Observaciones",
  READY_TO_PUBLISH: "Listo para Publicar",
};

export function ProjectStatusChart() {
  const { projectStatus } = useDashboard();

  const data = projectStatus.map((item: any) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    color: item.color,
  }));

  if (data.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle>Distribución de Proyectos por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No hay datos disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Distribución de Proyectos por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
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
