import type { User } from "../types/userTYpes";

export interface BulkUserImportResult {
  totalProcessed: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{
    rowNumber: number;
    email: string;
    nationalId: string;
    role: string;
    errorMessage: string;
  }>;
  importedUsers: User[];
}
