export interface User {
  id: string;
  name: string;
  initials: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  /** null means Internal — never both a clientId and Internal, per business-rules.md */
  clientId: string | null;
}

export interface Entry {
  id: string;
  userId: string;
  projectId: string;
  date: string; // ISO date (yyyy-mm-dd)
  hours: number; // quarter-hour increments
  description: string;
  billable: boolean;
  tags: string[];
}
