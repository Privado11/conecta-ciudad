import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Grupo1Service, { type NotificationLog } from '../services/Grupo1Service';

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todas' | 'no_leidas'>('todas');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Obtener email del usuario actual desde localStorage o authContext
        const userEmail = localStorage.getItem('userEmail') || 'admin@conectaciudad.com';
        
        const data = await Grupo1Service.getCommunicationsByRecipient(userEmail);
        setNotifications(data);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const marcarComoLeida = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, leida: true } : notif
      ) as any
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, leida: true })) as any
    );
  };

  const eliminarNotificacion = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Adaptamos para simular el campo "leida" basándonos en si la notificación es reciente
  const notificationsConEstado = notifications.map(n => ({
    ...n,
    leida: new Date(n.sendAt) < new Date(Date.now() - 24 * 60 * 60 * 1000) // Leída si tiene más de 24 horas
  }));

  const filteredNotifications = notificationsConEstado.filter(notif =>
    filter === 'todas' ? true : !notif.leida
  );

  const getTipoColor = (status: string) => {
    switch(status.toUpperCase()) {
      case 'SENT': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'FAILED': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (status: string) => {
    switch(status.toUpperCase()) {
      case 'SENT': return '✅';
      case 'FAILED': return '❌';
      default: return '📢';
    }
  };

  const noLeidasCount = notificationsConEstado.filter(n => !n.leida).length;

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
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTipoColor(notif.status)}`}>
                      {getTipoIcon(notif.status)} {notif.status}
                    </span>
                    {!notif.leida && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(notif.sendAt).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {notif.subject}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {notif.body}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    📌 Proyecto: {notif.projectName}
                  </p>
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