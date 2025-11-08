export type User = {
  id: number;
  name: string;
  nationalId: string;
  email: string;
  phone?: string;
  createdAt?: string;
  roles?: UserRole[];
  active?: boolean;
  lastActionAt?: string;
};

export type UserRole = "ADMIN" | "LIDER_COMUNITARIO" | "CURATOR" | "CIUDADANO";


export type UserStatus = "active" | "inactive"

