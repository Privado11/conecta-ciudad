import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/hooks/useDashboard";

export function RecentActivityTable() {
  const { recentActivity } = useDashboard();

  const getStatusBadgeVariant = (status: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  if (recentActivity.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Actividad Reciente del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No hay actividad reciente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Actividad Reciente del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.slice(0, 8).map((activity: any) => (
            <div
              key={activity.id}
              className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.user}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-4">
                <Badge variant={getStatusBadgeVariant(activity.status)}>
                  {activity.status === "success"
                    ? "Exitoso"
                    : activity.status === "warning"
                    ? "Advertencia"
                    : "Error"}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
