import { useEffect } from "react";
import useProject from "@/hooks/useProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProjectVotingResult } from "@/shared/interface/Projects";

export default function VotingResults() {
    const { votingResults, fetchVotingResults, loading } = useProject();
    const navigate = useNavigate();

    useEffect(() => {
        fetchVotingResults();
    }, []);

    if (loading && votingResults.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando resultados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Resultados de Votación
                    </h1>
                    <p className="text-muted-foreground">
                        Resumen de los proyectos con votación cerrada.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {votingResults.length > 0 ? (
                    votingResults.map((result: ProjectVotingResult) => (
                        <Card key={result.projectId} className="overflow-hidden">
                            <CardHeader className="bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{result.projectName}</CardTitle>
                                    <Badge
                                        variant={result.finalResult === "APPROVED" ? "default" : "destructive"}
                                        className={`text-sm px-3 py-1 ${result.finalResult === "APPROVED" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                    >
                                        {result.finalResult === "APPROVED" ? (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" /> APROBADO
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <XCircle className="w-4 h-4" /> RECHAZADO
                                            </span>
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-1">Descripción</h3>
                                            <p className="text-sm text-muted-foreground">{result.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-semibold mb-1">Presupuesto</h3>
                                                <p className="text-sm">${result.budget.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Cierre de Votación</h3>
                                                <p className="text-sm">{new Date(result.closedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-4">
                                        <h3 className="font-semibold">Estadísticas de Votación</h3>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                                                <div className="text-2xl font-bold text-green-600">{result.votesInFavor}</div>
                                                <div className="text-xs text-muted-foreground">A Favor</div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                                                <div className="text-2xl font-bold text-red-600">{result.votesAgainst}</div>
                                                <div className="text-xs text-muted-foreground">En Contra</div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                                                <div className="text-2xl font-bold">{result.totalVotes}</div>
                                                <div className="text-xs text-muted-foreground">Total</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Aprobación</span>
                                                <span className="font-bold">{(result.approvalPercentage * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${result.finalResult === "APPROVED" ? "bg-green-500" : "bg-red-500"}`}
                                                    style={{ width: `${result.approvalPercentage * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                                Se requiere &gt; 50% para aprobar
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                        <p className="text-muted-foreground">No hay resultados de votación disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
