import { useState, useEffect } from 'react';

interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'abierto' | 'cerrado' | 'aprobado' | 'rechazado';
  fechaCreacion: string;
  votosAfavor: number;
  votosContra: number;
}

export default function PublicProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todos');

  // Datos mock mientras el backend no está listo
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: 1,
        titulo: 'Parque Comunitario La Esperanza',
        descripcion: 'Construcción de un parque infantil en el barrio La Esperanza con zonas verdes y juegos para niños.',
        estado: 'abierto',
        fechaCreacion: '2025-10-15',
        votosAfavor: 150,
        votosContra: 30
      },
      {
        id: 2,
        titulo: 'Rehabilitación de Vías Principales',
        descripcion: 'Pavimentación y mejora de las calles principales del centro de la ciudad.',
        estado: 'cerrado',
        fechaCreacion: '2025-09-20',
        votosAfavor: 320,
        votosContra: 45
      },
      {
        id: 3,
        titulo: 'Centro Cultural Municipal',
        descripcion: 'Creación de un espacio para actividades culturales, talleres y eventos comunitarios.',
        estado: 'aprobado',
        fechaCreacion: '2025-08-10',
        votosAfavor: 280,
        votosContra: 20
      },
      {
        id: 4,
        titulo: 'Ciclovía Turística',
        descripcion: 'Construcción de una ciclovía que conecte los principales puntos turísticos de la ciudad.',
        estado: 'rechazado',
        fechaCreacion: '2025-07-05',
        votosAfavor: 90,
        votosContra: 250
      }
    ];

    // Simulamos una petición al backend
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter(p => 
    filter === 'todos' ? true : p.estado === filter
  );

  const getStatusColor = (estado: string) => {
    switch(estado) {
      case 'abierto': return 'bg-green-100 text-green-800';
      case 'cerrado': return 'bg-gray-100 text-gray-800';
      case 'aprobado': return 'bg-blue-100 text-blue-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (estado: string) => {
    switch(estado) {
      case 'abierto': return 'Abierto a votación';
      case 'cerrado': return 'Votación cerrada';
      case 'aprobado': return 'Aprobado';
      case 'rechazado': return 'Rechazado';
      default: return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal de Proyectos Públicos</h1>
        <p className="text-gray-600">Consulta todos los proyectos ciudadanos y sus estados</p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <button
          onClick={() => setFilter('todos')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'todos' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({projects.length})
        </button>
        <button
          onClick={() => setFilter('abierto')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'abierto' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Abiertos ({projects.filter(p => p.estado === 'abierto').length})
        </button>
        <button
          onClick={() => setFilter('cerrado')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'cerrado' 
              ? 'bg-gray-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cerrados ({projects.filter(p => p.estado === 'cerrado').length})
        </button>
        <button
          onClick={() => setFilter('aprobado')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'aprobado' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Aprobados ({projects.filter(p => p.estado === 'aprobado').length})
        </button>
        <button
          onClick={() => setFilter('rechazado')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'rechazado' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rechazados ({projects.filter(p => p.estado === 'rechazado').length})
        </button>
      </div>

      {/* Lista de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800 flex-1">{project.titulo}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.estado)}`}>
                {getStatusText(project.estado)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.descripcion}</p>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Fecha de creación:</span>
                <span className="font-medium">{new Date(project.fechaCreacion).toLocaleDateString('es-ES')}</span>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">👍 {project.votosAfavor}</span>
                  <span className="text-red-600 font-medium">👎 {project.votosContra}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Ver detalles →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay proyectos con el filtro seleccionado</p>
        </div>
      )}
    </div>
  );
}