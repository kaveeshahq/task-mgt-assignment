import { useEffect, useState, useCallback } from "react";
import type { Task, Priority, Status } from "../types";
import { fetchTasks, createTask, updateTask, deleteTask, fetchUsers } from "../api/tasks";
import TaskFormModal from "../components/TaskFormModal";

type ViewMode = "table" | "card";

const statusLabels: Record<Status, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  TESTING: "Testing",
  DONE: "Done",
};

const statusStyles: Record<Status, string> = {
  OPEN: "bg-ink/5 text-ink",
  IN_PROGRESS: "bg-navy/10 text-navy",
  TESTING: "bg-accent/10 text-accent",
  DONE: "bg-ink/5 text-ink/40",
};

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-ink/5 text-ink/60",
  MEDIUM: "bg-navy/10 text-navy",
  HIGH: "bg-accent text-white",
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks({ search, status: statusFilter, priority: priorityFilter });
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => {});
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setModalOpen(false);
    loadTasks();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(id);
    loadTasks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tasks</h1>
          <p className="text-ink/60 text-sm">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90">
          + New task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="px-3 py-2 rounded-md border border-ink/15 bg-white text-sm w-56 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "")}
          className="px-3 py-2 rounded-md border border-ink/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="TESTING">Testing</option>
          <option value="DONE">Done</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
          className="px-3 py-2 rounded-md border border-ink/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <div className="ml-auto flex rounded-md border border-ink/15 overflow-hidden">
          <button onClick={() => setView("table")} className={`px-3 py-2 text-sm ${view === "table" ? "bg-navy text-white" : "bg-white text-ink/60"}`}>
            Table
          </button>
          <button onClick={() => setView("card")} className={`px-3 py-2 text-sm ${view === "card" ? "bg-navy text-white" : "bg-white text-ink/60"}`}>
            Cards
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-ink/50 text-sm">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center text-ink/50 text-sm">No tasks yet. Create your first one.</div>
      ) : view === "table" ? (
        <div className="bg-white rounded-lg overflow-hidden border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink/[0.03] text-ink/60 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Due</th>
                <th className="text-left px-4 py-3">Assigned to</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t border-ink/5">
                  <td className={`px-4 py-3 font-medium ${task.status === "DONE" ? "line-through text-ink/40" : "text-ink"}`}>
                    {task.title}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyles[task.status]}`}>{statusLabels[task.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{task.assignedTo?.name || "Unassigned"}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(task)} className="text-navy hover:underline text-xs font-semibold">Edit</button>
                    <button onClick={() => handleDelete(task.id)} className="text-accent hover:underline text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg border border-ink/10 p-4 border-l-4"
              style={{ borderLeftColor: task.priority === "HIGH" ? "#FE7F2D" : task.priority === "MEDIUM" ? "#233D4D" : "#00000022" }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold text-ink ${task.status === "DONE" ? "line-through text-ink/40" : ""}`}>{task.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyles[task.status]}`}>{statusLabels[task.status]}</span>
              </div>
              {task.description && <p className="text-ink/60 text-sm mb-3 line-clamp-2">{task.description}</p>}
              <div className="flex items-center justify-between text-xs text-ink/50 mb-3">
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                <span>{task.assignedTo?.name || "Unassigned"}</span>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => openEdit(task)} className="text-navy hover:underline text-xs font-semibold">Edit</button>
                <button onClick={() => handleDelete(task.id)} className="text-accent hover:underline text-xs font-semibold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && <TaskFormModal task={editingTask} users={users} onClose={() => setModalOpen(false)} onSubmit={handleSave} />}
    </div>
  );
}