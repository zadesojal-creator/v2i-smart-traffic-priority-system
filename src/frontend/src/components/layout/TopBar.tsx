import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useAppStore } from "../../store/appStore";

export function TopBar({ title }: { title?: string }) {
  const { theme, toggleTheme, notifications, toggleSidebar } = useAppStore();
  const unread = notifications.length;

  return (
    <header
      className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1">
        <h1
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title ?? "V2I Smart Traffic System"}
        </h1>
      </div>

      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          width: 200,
        }}
      >
        <Search size={14} style={{ color: "var(--text-muted)" }} />
        <input
          placeholder="Search..."
          className="bg-transparent text-sm outline-none flex-1"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <button
        onClick={toggleTheme}
        className="p-1.5 rounded-lg"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <button
        className="p-1.5 rounded-lg relative"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span
            className="absolute top-0 right-0 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
            style={{ background: "var(--accent-red)", fontSize: 9 }}
          >
            {Math.min(unread, 9)}
          </span>
        )}
      </button>
    </header>
  );
}
