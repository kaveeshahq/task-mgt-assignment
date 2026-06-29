import api from "./axios";
import type { Task, Priority, Status } from "../types";

export interface TaskFilters {
  status?: Status | "";
  priority?: Priority | "";
  search?: string;
}

export const fetchTasks = async (filters: TaskFilters = {}) => {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.search) params.search = filters.search;
  const res = await api.get<Task[]>("/tasks", { params });
  return res.data;
};

export const createTask = async (data: Partial<Task> & { title: string }) => {
  const res = await api.post<Task>("/tasks", data);
  return res.data;
};

export const updateTask = async (id: number, data: Partial<Task>) => {
  const res = await api.put<Task>(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data as { id: number; name: string; email: string; role: string }[];
};