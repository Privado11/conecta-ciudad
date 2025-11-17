import { useState, useEffect } from 'react';
import { History, Mail, Send, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';

interface Communication {
  id: number;
  tipo: 'email' | 'push' | 'sms';
  destinatario: string;
  asunto: string;
  mensaje: string;
  estado: 'enviado' | 'fallido' | 'pendiente';
  fechaEnvio: string;
  evento: string;
}

export default function CommunicationsHistory() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos mock - Reemplazar con llamada al backend del Grupo 1
  useEffect(() => {
    const mockCommunications: Communication[] = [
      {
        id: 1,
        tipo: 'email',
        destinatario: 'usuario1@example.com',
        asunto: 'Nuevo proyecto publicado',
        mensaje: 'El proyecto "Parque Comunitario" ha sido publicado y está abierto a votación.',
        estado: 'enviado',
        fechaEnvio: '2025-11-15T10:30:00',
        evento: 'proyecto_publicado'
      },
      {
        id: 2,
        tipo: 'push',
        destinatario: 'usuario2@example.com',
        asunto: 'Confirmación de voto',
        mensaje: 'Tu voto en el proyecto "Rehabilitación de Vías" ha sido registrado exitosamente.',
        estado: 'enviado',
        fechaEnvio: '2025-11-15T09:15:00',
        evento: 'voto_confirmado'
      },
      {
        id: 3,
        tipo: 'email',
        destinatario: 'usuario3@example.com',
        asunto: 'Votación cerrada',
        mensaje: 'La votación del proyecto "Centro Cultural" ha finalizado. Consulta los resultados.',
        estado: 'enviado',
        fechaEnvio: '2025-11-14T18:00:00',
        evento: 'votacion_cerrada'
      },
      {
        id: 4,
        tipo: 'sms',
        destinatario: '+57 300 123 4567',
        asunto: 'Proyecto aprobado',
        mensaje: 'El proyecto "Parque La Esperanza" ha sido aprobado con 84% de votos a favor.',
        estado: 'fallido',
        fechaEnvio: '2025-11-14T15:45:00',
        evento: 'proyecto_aprobado'
      },
      {
        id: 5,
        tipo: 'email',
        destinatario: 'lider@example.com',
        asunto: 'Proyecto en revisión',
        mensaje: 'Tu proyecto ha sido enviado a revisión por un curador.',
        estado: 'enviado',
        fechaEnvio: '2025-11-13T14:20:00',
        evento: 'proyecto_revision'
      },
      {
        id: 6,
        tipo: 'push',
        destinatario: 'usuario4@example.com',
        asunto: 'Recordatorio de votación',
        mensaje: 'Quedan 24 horas para votar en el proyecto "Ciclovía Turística".',
        estado: 'pendiente',
        fechaEnvio: '2025-11-16T08:00:00',
        evento: 'recordatorio_votacion'
      }
    ];

    setTimeout(() => {
      setCommunications(mockCommunications);
      setLoading(false);
    }, 800);
  }, []);

  const filteredCommunications = communications.filter(comm => {
    const matchEstado = filterEstado === 'todos' || comm.estado === filterEstado;
    const matchTipo = filterTipo === 'todos' || comm.tipo === filterTipo;
    const matchSearch = comm.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       comm.asunto.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEstado && matchTipo && matchSearch;
  });

  const getStatusIcon = (estado: string) => {
    switch(estado) {
      case 'enviado': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fallido': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pendiente': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (estado: string) => {
    switch(estado) {
      case 'enviado': return 'bg-green-100 text-green-800 border-green-200';
      case 'fallido': return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'push': return <Send className="w-4 h-4" />;
      case 'sms': return <Mail className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'push': return 'bg-purple-100 text-purple-800';
      case 'sms': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Historial de Comunicaciones
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Trazabilidad completa de todas las notificaciones enviadas
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Enviados</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {communications.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Exitosos</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {communications.filter(c => c.estado === 'enviado').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Fallidos</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {communications.filter(c => c.estado === 'fallido').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {communications.filter(c => c.estado === 'pendiente').length}
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por destinatario o asunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="enviado">Enviados</option>
              <option value="fallido">Fallidos</option>
              <option value="pendiente">Pendientes</option>
            </select>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="email">Email</option>
              <option value="push">Push</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de comunicaciones */}
      <div className="space-y-3">
        {filteredCommunications.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
            <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">No se encontraron comunicaciones</p>
          </div>
        ) : (
          filteredCommunications.map(comm => (
            <div 
              key={comm.id}
              className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoColor(comm.tipo)} flex items-center gap-1`}>
                      {getTipoIcon(comm.tipo)}
                      {comm.tipo.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(comm.estado)} flex items-center gap-1`}>
                      {getStatusIcon(comm.estado)}
                      {comm.estado.charAt(0).toUpperCase() + comm.estado.slice(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comm.fechaEnvio).toLocaleString('es-ES')}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {comm.asunto}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {comm.mensaje}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>📧 {comm.destinatario}</span>
                    <span>📌 {comm.evento.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}