import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

export function VotingActivityChart() {
  const { votingActivityData } = useDashboard();

  console.log("DATA DASHBOARD:", votingActivityData);

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  

  const data = votingActivityData.slice(0, 6).map(item => {
    const daysRemaining = getDaysRemaining(item.endDate);
    const truncatedName = item.projectName.length > 20 
      ? item.projectName.substring(0, 20) + '...' 
      : item.projectName;
    
    return {
      id: item.id,
      name: `${truncatedName} (${item.id})`,
      votes: item.votes,
      fullName: item.projectName,
      endDate: formatDate(item.endDate),
      daysRemaining,
      color:
        daysRemaining <= 2 ? '#ef4444' : 
        daysRemaining <= 7 ? '#f97316' : 
        '#8b5cf6'                       
    };
  });

  if (data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Actividad de Votaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No hay votaciones activas
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Los proyectos publicados aparecerán aquí cuando estén en período de votación
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Actividad de Votaciones
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {data.length} {data.length === 1 ? 'proyecto activo' : 'proyectos activos'} en votación
            </p>
          </div>

          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-muted-foreground">≤ 2 días</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-muted-foreground">≤ 7 días</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-muted-foreground">&gt; 7 días</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              fontSize={11}
              interval={0}
            />
            <YAxis 
              label={{ value: 'Número de Votos', angle: -90, position: 'insideLeft', fontSize: 12 }}
              fontSize={11}
            />

            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border-2 rounded-lg p-3 shadow-xl">
                      <p className="text-xs text-muted-foreground">ID: {data.id}</p>
                      <p className="font-semibold text-sm mb-2">{data.fullName}</p>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                          <span className="text-muted-foreground">Votos:</span>
                          <span className="font-bold">{data.votes}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-muted-foreground">Finaliza:</span>
                          <span className="font-medium">{data.endDate}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: data.color }} />
                          <span className="text-muted-foreground">Quedan:</span>
                          <span className="font-bold" style={{ color: data.color }}>
                            {data.daysRemaining} {data.daysRemaining === 1 ? 'día' : 'días'}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey="votes" radius={[8, 8, 0, 0]} maxBarSize={80}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            

            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Total de votos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {data.reduce((sum, item) => sum + item.votes, 0)}
                </p>
              </div>
            </div>

    
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Próximo cierre</p>
                <p className="text-lg font-semibold text-blue-600">
                  {[...data].sort((a, b) => a.daysRemaining - b.daysRemaining)[0]?.endDate || 'N/A'}
                </p>
              </div>
            </div>

   
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Urgentes</p>
                <p className="text-2xl font-bold text-red-600">
                  {data.filter(item => item.daysRemaining <= 2).length}
                </p>
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}
