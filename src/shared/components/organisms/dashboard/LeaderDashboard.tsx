import useProject from "@/hooks/useProject";
import { StatCard } from "../../atoms/dashboard/StatCard";
import { LIDER_STATS } from "@/shared/constants/LiderStats";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IProject } from "@/shared/interface/Projects";

export function LeaderDashboard() {
    const { stats, loading, projects } = useProject();
    const navigate = useNavigate();

    if (loading && stats.total === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    const recentProjects = projects.slice(0, 5);

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard de Líder Comunitario
                    </h1>
                    <p className="text-muted-foreground">
                        Bienvenido. Aquí tienes un resumen de tus proyectos y actividades.
                    </p>
                </div>
                <Button onClick={() => navigate("/leader/projects")}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {LIDER_STATS.map(({ label, icon: Icon, valueKey }) => (
                    <StatCard
                        key={valueKey}
                        title={label === "Total Lideres" ? "Total Proyectos" : label}
                        value={stats[valueKey as keyof typeof stats]}
                        icon={Icon as any}
                    />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Accesos Rápidos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Button variant="outline" className="justify-start" onClick={() => navigate("/leader/projects")}>
                            <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Proyecto
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate("/leader/projects")}>
                            <ArrowRight className="mr-2 h-4 w-4" /> Ver Todos los Proyectos
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate("/leader/projects/voting-results")}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Ver Resultados de Votación
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Proyectos Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentProjects.length > 0 ? (
                            <div className="space-y-4">
                                {recentProjects.map((project: IProject) => (
                                    <div key={project.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{project.name}</p>
                                            <p className="text-sm text-muted-foreground">{project.status}</p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(project.startAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">No hay proyectos recientes.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
