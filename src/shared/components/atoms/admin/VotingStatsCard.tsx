import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VotingStats } from "@/shared/types/votingTypes";
import {
  BarChart3,
  CheckCircle,
  TrendingUp,
  Users,
  Vote,
  XCircle,
} from "lucide-react";

interface VotingStatsCardProps {
  stats?: VotingStats | null;
  loading?: boolean;
}

export function VotingStatsCard({
  stats,
  loading = false,
}: VotingStatsCardProps) {
  const statItems = stats
    ? [
        {
          label: "Total Votaciones",
          value: stats.totalVotations,
          icon: Vote,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          label: "Votaciones Abiertas",
          value: stats.openVotations,
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          label: "Votaciones Cerradas",
          value: stats.closedVotations,
          icon: BarChart3,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        },
        {
          label: "Total Votos Emitidos",
          value: stats.totalVotesCast.toLocaleString(),
          icon: Users,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ]
    : [];

  const rateItems = stats
    ? [
        {
          label: "Participación Promedio",
          value: `${(stats.averageParticipationRate * 100).toFixed(1)}%`,
          icon: Users,
          color: "text-blue-700",
        },
        {
          label: "Tasa de Aprobación",
          value: `${stats.approvalRate.toFixed(1)}%`,
          icon: CheckCircle,
          color: "text-green-700",
        },
        {
          label: "Tasa de Rechazo",
          value: `${stats.rejectionRate.toFixed(1)}%`,
          icon: XCircle,
          color: "text-red-700",
        },
        {
          label: "Votos por Proyecto",
          value: stats.averageVotesPerProject.toFixed(1),
          icon: BarChart3,
          color: "text-purple-700",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 bg-muted animate-pulse rounded-lg" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        <Card className="overflow-hidden">
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-3 gap-2"
                >
                  <div className="h-6 w-6 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{item.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rateItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-3"
              >
                <item.icon className={`w-6 h-6 mb-2 ${item.color}`} />
                <span className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
