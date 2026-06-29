import { useState } from "react";
import type { SubmitEventHandler } from "react";
import type { Task, Priority, Status } from "../types";

interface UserOption {
  id: number;
  name: string;
}

interface TaskFormModalProps {
  task: Task | null;
  users: UserOption[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function TaskFormModal({ task, users, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<Priority>(task?.priority || "MEDIUM");
  const [status, setStatus] = useState<Status>(task?.status || "OPEN");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : "");
  const [assignedToId, setAssignedToId] = useState<string>(task?.assignedToId ? String(task.assignedToId) : "");
  const [saving, setSaving] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        status,
        dueDate: dueDate || null,
        assignedToId: assignedToId ? Number(assignedToId) : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 font-sans">
        <h2 className="text-lg font-bold text-ink mb-4">{task ? "Edit task" : "New task"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-ink/15 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Description</label>
            <textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-ink/15 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-md border border-ink/15 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 rounded-md border border-ink/15 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="TESTING">Testing</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-ink/15 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Assign to</label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-ink/15 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}