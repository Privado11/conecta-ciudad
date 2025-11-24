import api from "../service/api";

//  Estructura según TU backend (Notification.java)
interface NotificationLog {
  id: number;
  projectId: number;
  projectName: string;
  sendTo: string;
  sendFrom: string;
  subject: string;
  body: string;
  channel: 'EMAIL';
  sendAt: string;
  status: 'SENT' | 'FAILED';
  errorMessage: string | null;
}

// DATOS MOCK - Solo para pruebas mientras el backend no esté desplegado
const MOCK_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 1,
    projectId: 1,
    projectName: "Parque Comunitario La Esperanza",
    sendTo: "usuario1@example.com",
    sendFrom: "noreply@conectaciudad.com",
    subject: "Nuevo proyecto publicado",
    body: "El proyecto 'Parque Comunitario' ha sido publicado y está abierto a votación.",
    channel: "EMAIL",
    sendAt: "2025-11-15T10:30:00",
    status: "SENT",
    errorMessage: null
  },
  {
    id: 2,
    projectId: 2,
    projectName: "Rehabilitación de Vías Principales",
    sendTo: "usuario2@example.com",
    sendFrom: "noreply@conectaciudad.com",
    subject: "Confirmación de voto",
    body: "Tu voto en el proyecto 'Rehabilitación de Vías' ha sido registrado exitosamente.",
    channel: "EMAIL",
    sendAt: "2025-11-15T09:15:00",
    status: "SENT",
    errorMessage: null
  },
  {
    id: 3,
    projectId: 3,
    projectName: "Centro Cultural Municipal",
    sendTo: "usuario3@example.com",
    sendFrom: "noreply@conectaciudad.com",
    subject: "Votación cerrada",
    body: "La votación del proyecto 'Centro Cultural' ha finalizado. Consulta los resultados.",
    channel: "EMAIL",
    sendAt: "2025-11-14T18:00:00",
    status: "SENT",
    errorMessage: null
  },
  {
    id: 4,
    projectId: 1,
    projectName: "Parque La Esperanza",
    sendTo: "admin@conectaciudad.com",
    sendFrom: "noreply@conectaciudad.com",
    subject: "Proyecto aprobado",
    body: "El proyecto 'Parque La Esperanza' ha sido aprobado con 84% de votos a favor.",
    channel: "EMAIL",
    sendAt: "2025-11-14T15:45:00",
    status: "FAILED",
    errorMessage: "Connection timeout"
  },
  {
    id: 5,
    projectId: 2,
    projectName: "Rehabilitación de Vías",
    sendTo: "lider@example.com",
    sendFrom: "noreply@conectaciudad.com",
    subject: "Proyecto en revisión",
    body: "Tu proyecto ha sido enviado a revisión por un curador.",
    channel: "EMAIL",
    sendAt: "2025-11-13T14:20:00",
    status: "SENT",
    errorMessage: null
  },
  {
    id: 6,
    projectId: 4,
    projectName: "Ciclovía Turística",
    sendTo: "usuario4@example.com",
    sendFrom: "noreply@conectaciudad.com",
    subject: "Recordatorio de votación",
    body: "Quedan 24 horas para votar en el proyecto 'Ciclovía Turística'.",
    channel: "EMAIL",
    sendAt: "2025-11-16T08:00:00",
    status: "SENT",
    errorMessage: null
  }
];

//  Cambiar a false cuando TU backend esté desplegado
const USE_MOCK = true;

class Grupo1Service {
  /**
   * Obtener historial completo de comunicaciones
   * Endpoint: GET /notifications/logs
   */
  async getAllCommunications(): Promise<NotificationLog[]> {
    if (USE_MOCK) {
      console.log('📦 [GRUPO 1] Usando datos MOCK para historial completo');
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_NOTIFICATIONS), 800);
      });
    }

    try {
      console.log('🌐 [GRUPO 1] Obteniendo historial desde API...');
      const response = await api.get('/notifications/logs');
      console.log('✅ [GRUPO 1] Historial obtenido exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ [GRUPO 1] Error al obtener historial, usando MOCK:', error);
      return MOCK_NOTIFICATIONS;
    }
  }

  /**
   * Filtrar comunicaciones por nombre de proyecto
   * Endpoint: GET /notifications/logs?projectName={nombre}
   */
  async getCommunicationsByProject(projectName: string): Promise<NotificationLog[]> {
    if (USE_MOCK) {
      console.log(`📦 [GRUPO 1] Filtrando MOCK por proyecto: ${projectName}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = MOCK_NOTIFICATIONS.filter(n =>
            n.projectName.toLowerCase().includes(projectName.toLowerCase())
          );
          resolve(filtered);
        }, 500);
      });
    }

    try {
      console.log(`🌐 [GRUPO 1] Filtrando por proyecto: ${projectName}`);
      const response = await api.get('/notifications/logs', {
        params: { projectName }
      });
      console.log('✅ [GRUPO 1] Filtrado exitoso');
      return response.data;
    } catch (error) {
      console.error('❌ [GRUPO 1] Error al filtrar, usando MOCK:', error);
      return MOCK_NOTIFICATIONS.filter(n =>
        n.projectName.toLowerCase().includes(projectName.toLowerCase())
      );
    }
  }

  /**
   * Filtrar comunicaciones por destinatario
   * Endpoint: GET /notifications/logs?sendTo={email}
   */
  async getCommunicationsByRecipient(sendTo: string): Promise<NotificationLog[]> {
    if (USE_MOCK) {
      console.log(`📦 [GRUPO 1] Filtrando MOCK por destinatario: ${sendTo}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = MOCK_NOTIFICATIONS.filter(n =>
            n.sendTo.toLowerCase().includes(sendTo.toLowerCase())
          );
          resolve(filtered);
        }, 500);
      });
    }

    try {
      console.log(`🌐 [GRUPO 1] Filtrando por destinatario: ${sendTo}`);
      const response = await api.get('/notifications/logs', {
        params: { sendTo }
      });
      console.log('✅ [GRUPO 1] Filtrado exitoso');
      return response.data;
    } catch (error) {
      console.error('❌ [GRUPO 1] Error al filtrar, usando MOCK:', error);
      return MOCK_NOTIFICATIONS.filter(n =>
        n.sendTo.toLowerCase().includes(sendTo.toLowerCase())
      );
    }
  }

  /**
   * Filtrar por proyecto Y destinatario
   * Endpoint: GET /notifications/logs?projectName={nombre}&sendTo={email}
   */
  async getCommunicationsByFilters(
    projectName?: string,
    sendTo?: string
  ): Promise<NotificationLog[]> {
    if (USE_MOCK) {
      console.log('📦 [GRUPO 1] Filtrando MOCK con múltiples criterios');
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = MOCK_NOTIFICATIONS;

          if (projectName) {
            filtered = filtered.filter(n =>
              n.projectName.toLowerCase().includes(projectName.toLowerCase())
            );
          }

          if (sendTo) {
            filtered = filtered.filter(n =>
              n.sendTo.toLowerCase().includes(sendTo.toLowerCase())
            );
          }

          resolve(filtered);
        }, 500);
      });
    }

    try {
      console.log('🌐 [GRUPO 1] Filtrando con múltiples criterios');
      const params: any = {};
      if (projectName) params.projectName = projectName;
      if (sendTo) params.sendTo = sendTo;

      const response = await api.get('/notifications/logs', { params });
      console.log('✅ [GRUPO 1] Filtrado exitoso');
      return response.data;
    } catch (error) {
      console.error('❌ [GRUPO 1] Error al filtrar, usando MOCK:', error);
      let filtered = MOCK_NOTIFICATIONS;

      if (projectName) {
        filtered = filtered.filter(n =>
          n.projectName.toLowerCase().includes(projectName.toLowerCase())
        );
      }

      if (sendTo) {
        filtered = filtered.filter(n =>
          n.sendTo.toLowerCase().includes(sendTo.toLowerCase())
        );
      }

      return filtered;
    }
  }
}

export default new Grupo1Service();
export type { NotificationLog };