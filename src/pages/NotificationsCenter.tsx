import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  leida: boolean;
  fecha: string;
  accion?: {
    texto: string;
    ruta: string;
  };
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todas' | 'no_leidas'>('todas');

  // Datos mock - Reemplazar con llamada al backend del Grupo 1
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        titulo: 'Nuevo proyecto publicado',
        mensaje: 'El proyecto "Parque Comunitario La Esperanza" ha sido publicado y está abierto a votación.',
        tipo: 'info',
        leida: false,
        fecha: '2025-11-16T10:30:00',
        accion: {
          texto: 'Ver proyecto',
          ruta: '/projects/public'
        }
      },
      {
        id: 2,
        titulo: 'Tu voto ha sido registrado',
        mensaje: 'Tu voto en el proyecto "Rehabilitación de Vías Principales" ha sido confirmado exitosamente.',
        tipo: 'success',
        leida: false,
        fecha: '2025-11-15T16:45:00'
      },
      {
        id: 3,
        titulo: 'Votación cerrada',
        mensaje: 'La votación del proyecto "Centro Cultural Municipal" ha finalizado. Los resultados ya están disponibles.',
        tipo: 'warning',
        leida: true,
        fecha: '2025-11-14T18:00:00',
        accion: {
          texto: 'Ver resultados',
          ruta: '/results'
        }
      },
      {
        id: 4,
        titulo: 'Proyecto aprobado',
        mensaje: 'El proyecto "Parque La Esperanza" ha sido aprobado con el 84% de los votos a favor.',
        tipo: 'success',
        leida: true,
        fecha: '2025-11-13T20:15:00',
        accion: {
          texto: 'Ver detalles',
          ruta: '/results/1'
        }
      },
      {
        id: 5,
        titulo: 'Recordatorio: Última oportunidad para votar',
        mensaje: 'Quedan menos de 24 horas para votar en el proyecto "Ciclovía Turística".',
        tipo: 'warning',
        leida: false,
        fecha: '2025-11-16T08:00:00',
        accion: {
          texto: 'Ir a votar',
          ruta: '/projects/public'
        }
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);
  }, []);

  const marcarComoLeida = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const eliminarNotificacion = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'todas' ? true : !notif.leida
  );

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case 'info': return '💡';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  const noLeidasCount = notifications.filter(n => !n.leida).length;

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg relative">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {noLeidasCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {noLeidasCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Centro de Notificaciones
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {noLeidasCount > 0 ? `Tienes ${noLeidasCount} notificaciones sin leer` : 'No tienes notificaciones nuevas'}
              </p>
            </div>
          </div>
          
          {noLeidasCount > 0 && (
            <button
              onClick={marcarTodasComoLeidas}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('todas')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'todas'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('no_leidas')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'no_leidas'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          No leídas ({noLeidasCount})
        </button>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              {filter === 'no_leidas' 
                ? '¡Genial! No tienes notificaciones pendientes' 
                : 'No tienes notificaciones'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              className={`bg-white dark:bg-slate-950 rounded-lg border p-5 transition-all ${
                notif.leida
                  ? 'border-slate-200 dark:border-slate-800'
                  : 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTipoColor(notif.tipo)}`}>
                      {getTipoIcon(notif.tipo)} {notif.tipo.toUpperCase()}
                    </span>
                    {!notif.leida && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(notif.fecha).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {notif.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {notif.mensaje}
                  </p>

                  {notif.accion && (
                    <Link
                        to={notif.accion.ruta}
                         className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                     >
                     {notif.accion.texto} →
                         </Link>
                    )}  
                </div>

                <div className="flex gap-2">
                  {!notif.leida && (
                    <button
                      onClick={() => marcarComoLeida(notif.id)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Marcar como leída"
                    >
                      <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  )}
                  <button
                    onClick={() => eliminarNotificacion(notif.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}