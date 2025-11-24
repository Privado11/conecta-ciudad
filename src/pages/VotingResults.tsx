/*
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ProjectResult {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'cerrado' | 'aprobado' | 'rechazado';
  fechaInicio: string;
  fechaCierre: string;
  totalVotos: number;
  votosAfavor: number;
  votosContra: number;
  porcentajeAprobacion: number;
  participacion: number;
}

export default function VotingResults() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ProjectResult[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Datos mock - Reemplazar con llamada al backend del Grupo 1
  useEffect(() => {
    const mockResults: ProjectResult[] = [
      {
        id: 1,
        titulo: 'Parque Comunitario La Esperanza',
        descripcion: 'Construcción de un parque infantil en el barrio La Esperanza con zonas verdes y juegos para niños.',
        estado: 'aprobado',
        fechaInicio: '2025-10-15',
        fechaCierre: '2025-10-25',
        totalVotos: 450,
        votosAfavor: 380,
        votosContra: 70,
        porcentajeAprobacion: 84.4,
        participacion: 75.5
      },
      {
        id: 2,
        titulo: 'Rehabilitación de Vías Principales',
        descripcion: 'Pavimentación y mejora de las calles principales del centro de la ciudad.',
        estado: 'cerrado',
        fechaInicio: '2025-09-20',
        fechaCierre: '2025-10-05',
        totalVotos: 580,
        votosAfavor: 520,
        votosContra: 60,
        porcentajeAprobacion: 89.7,
        participacion: 82.3
      },
      {
        id: 3,
        titulo: 'Centro Cultural Municipal',
        descripcion: 'Creación de un espacio para actividades culturales, talleres y eventos comunitarios.',
        estado: 'aprobado',
        fechaInicio: '2025-08-10',
        fechaCierre: '2025-08-30',
        totalVotos: 420,
        votosAfavor: 350,
        votosContra: 70,
        porcentajeAprobacion: 83.3,
        participacion: 68.2
      },
      {
        id: 4,
        titulo: 'Ciclovía Turística',
        descripcion: 'Construcción de una ciclovía que conecte los principales puntos turísticos de la ciudad.',
        estado: 'rechazado',
        fechaInicio: '2025-07-05',
        fechaCierre: '2025-07-20',
        totalVotos: 390,
        votosAfavor: 120,
        votosContra: 270,
        porcentajeAprobacion: 30.8,
        participacion: 55.8
      }
    ];

    setTimeout(() => {
      setResults(mockResults);
      if (id) {
        const project = mockResults.find(p => p.id === parseInt(id));
        setSelectedProject(project || null);
      }
      setLoading(false);
    }, 800);
  }, [id]);

  const getStatusIcon = (estado: string) => {
    switch(estado) {
      case 'aprobado': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rechazado': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'cerrado': return <Clock className="w-5 h-5 text-gray-600" />;
      default: return null;
    }
  };

  const getStatusColor = (estado: string) => {
    switch(estado) {
      case 'aprobado': return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
      case 'cerrado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (estado: string) => {
    switch(estado) {
      case 'aprobado': return 'Aprobado';
      case 'rechazado': return 'Rechazado';
      case 'cerrado': return 'Votación Cerrada';
      default: return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */ /*}
      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Resultados de Votaciones
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Consulta los resultados finales de las votaciones ciudadanas
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */ /*}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Proyectos</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{results.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Proyectos Aprobados</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {results.filter(p => p.estado === 'aprobado').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Participación Promedio</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {(results.reduce((acc, p) => acc + p.participacion, 0) / results.length).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Resultados */ /*}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resultados por Proyecto</h2>
        
        {results.map(project => (
          <div 
            key={project.id} 
            className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {project.titulo}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.estado)} flex items-center gap-1`}>
                    {getStatusIcon(project.estado)}
                    {getStatusText(project.estado)}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                  {project.descripcion}
                </p>
                <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>📅 Inicio: {new Date(project.fechaInicio).toLocaleDateString('es-ES')}</span>
                  <span>🏁 Cierre: {new Date(project.fechaCierre).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>

            {/* Barra de progreso */ /*}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">Resultados</span>
                <span className="text-slate-600 dark:text-slate-400">{project.totalVotos} votos totales</span>
              </div>
              
              <div className="relative h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-medium transition-all"
                  style={{ width: `${project.porcentajeAprobacion}%` }}
                >
                  {project.porcentajeAprobacion > 10 && `${project.porcentajeAprobacion.toFixed(1)}%`}
                </div>
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-medium transition-all"
                  style={{ width: `${100 - project.porcentajeAprobacion}%` }}
                >
                  {(100 - project.porcentajeAprobacion) > 10 && `${(100 - project.porcentajeAprobacion).toFixed(1)}%`}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-slate-700 dark:text-slate-300">A favor: <strong>{project.votosAfavor}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-slate-700 dark:text-slate-300">En contra: <strong>{project.votosContra}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Participación: <strong className="text-slate-900 dark:text-slate-100">{project.participacion}%</strong></span>
                </div>
                <button 
                  onClick={() => navigate(`/results/${project.id}`)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                >
                  Ver detalles →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  */