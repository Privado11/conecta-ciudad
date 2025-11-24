import { Card, CardContent } from "@/components/ui/card";
import type { CitizenVotingStats } from "@/shared/types/votingTypes";
import { Vote, ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react";

interface CitizenVotingStatsCardProps {
  stats?: CitizenVotingStats | null;
  loading?: boolean;
}

export function CitizenVotingStatsCard({
  stats,
  loading = false,
}: CitizenVotingStatsCardProps) {
  const statItems = stats
    ? [
        {
          label: "Total de Votos",
          value: stats.totalVotes,
          icon: Vote,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          label: "Votos a Favor",
          value: stats.votesInFavor,
          icon: ThumbsUp,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          label: "Votos en Contra",
          value: stats.votesAgainst,
          icon: ThumbsDown,
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
        {
          label: "Tasa de Participación",
          value: `${(stats.participationRate * 100).toFixed(1)}%`,
          icon: TrendingUp,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
      ]
    : [];

  if (loading) {
    return (
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
    );
  }

  return (
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
  );
}
