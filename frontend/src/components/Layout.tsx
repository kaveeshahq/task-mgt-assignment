import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex font-sans">
      <aside className="w-64 bg-navy flex flex-col justify-between p-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="text-xl font-extrabold text-white tracking-tight">TaskFlow</span>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <nav className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 text-white text-sm font-medium">
              Tasks
            </div>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-white text-sm font-semibold">{user?.name}</p>
          <p className="text-white/50 text-xs mb-3">
            {user?.role === "ADMIN" ? "Administrator" : "Member"}
          </p>
          <button onClick={handleLogout} className="text-xs text-white/70 hover:text-accent transition">
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-surface p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}