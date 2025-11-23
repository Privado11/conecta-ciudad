import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CuratorReviewTrendData } from '@/shared/types/curatorTypes';

interface ReviewTrendChartProps {
  data: CuratorReviewTrendData[];
}

export function ReviewTrendChart({ data }: ReviewTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle>Tendencia de Revisiones (Últimos 6 Meses)</CardTitle>
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
        <CardTitle>Tendencia de Revisiones (Últimos 6 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} debounce={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="reviewed" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Total Revisadas"
            />
            <Line 
              type="monotone" 
              dataKey="approved" 
              stroke="#34d399" 
              strokeWidth={2}
              name="Aprobadas"
            />
            <Line 
              type="monotone" 
              dataKey="returned" 
              stroke="#f97316" 
              strokeWidth={2}
              name="Devueltas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
