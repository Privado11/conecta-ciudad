export interface IUser {
  id: number;
  name: string;
  email: string;
}

export type ProjectStatus =
  | "PENDIENTE"
  | "EN_REVISION"
  | "OBSERVACIONES"
  | "LISTO_PARA_PUBLICAR"
  | "PUBLICADO"
  | "DEVUELTO";

export interface IProject {
  id: number;
  name: string;
  objectives: string;
  beneficiaryPopulations: string;
  budgets: string | number;
  startAt: string;
  endAt: string;
  status: ProjectStatus;
  creator: IUser;
  curator: IUser | null;
  reviewNotes: string | null;
  reviewDueAt: string | null;
  reviewedAt: string | null;
}

export interface ProjectCreateDTO {
  name: string;
  objectives: string;
  beneficiaryPopulations: string;
  budgets: string;
  startAt: string;
  endAt: string;
}
