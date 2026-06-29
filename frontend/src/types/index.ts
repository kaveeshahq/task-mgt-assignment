export type Role = "ADMIN" | "USER";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  createdById: number;
  assignedToId: number | null;
  createdBy: { id: number; name: string; email: string };
  assignedTo: { id: number; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}