import { useState, useEffect } from 'react';
import { History, Mail, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import Grupo1Service, { type NotificationLog } from '../services/Grupo1Service';

export default function CommunicationsHistory() {
  const [communications, setCommunications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCommunications = async () => {
      setLoading(true);
      try {
        const data = await Grupo1Service.getAllCommunications();
        setCommunications(data);
      } catch (error) {
        console.error('Error al cargar comunicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, []);

  const filteredCommunications = communications.filter(comm => {
    const matchEstado = filterEstado === 'todos' || comm.status.toLowerCase() === filterEstado.toLowerCase();
    const matchSearch = comm.sendTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       comm.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEstado && matchSearch;
  });

  const getStatusIcon = (status: string) => {
    switch(status.toUpperCase()) {
      case 'SENT': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toUpperCase()) {
      case 'SENT': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status.toUpperCase()) {
      case 'SENT': return 'Enviado';
      case 'FAILED': return 'Fallido';
      default: return status;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Enviados</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {communications.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Exitosos</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {communications.filter(c => c.status === 'SENT').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Fallidos</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {communications.filter(c => c.status === 'FAILED').length}
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
                placeholder="Buscar por destinatario, asunto o proyecto..."
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
              <option value="sent">Enviados</option>
              <option value="failed">Fallidos</option>
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
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {comm.channel}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(comm.status)} flex items-center gap-1`}>
                      {getStatusIcon(comm.status)}
                      {getStatusText(comm.status)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comm.sendAt).toLocaleString('es-ES')}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {comm.subject}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {comm.body}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>📧 {comm.sendTo}</span>
                    <span>📌 {comm.projectName}</span>
                  </div>

                  {comm.errorMessage && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
                      <strong>Error:</strong> {comm.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}