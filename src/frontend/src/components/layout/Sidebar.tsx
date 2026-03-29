import {
  Activity,
  AlertTriangle,
  Ambulance,
  BarChart2,
  Bell,
  BellRing,
  BookOpen,
  ChevronRight,
  ClipboardList,
  CloudRain,
  FileText,
  Flag,
  Globe,
  HeartPulse,
  LayoutDashboard,
  List,
  LogOut,
  Map as MapIcon,
  MessageSquare,
  Navigation,
  Package,
  Radio,
  Settings,
  Shield,
  TrafficCone,
  Trophy,
  Truck,
  Users2,
  Wifi,
  Wrench,
  X,
} from "lucide-react";
import { useAppStore } from "../../store/appStore";
import type { Role } from "../../types";

const NAV_MAP: Record<
  Role,
  { icon: React.ElementType; label: string; view: string }[]
> = {
  tmc_operator: [
    { icon: LayoutDashboard, label: "Overview", view: "overview" },
    { icon: MapIcon, label: "Live Map", view: "livemap" },
    { icon: Radio, label: "Dispatch", view: "dispatch" },
    { icon: AlertTriangle, label: "Incidents", view: "incidents" },
    { icon: Truck, label: "Resources", view: "resources" },
    { icon: CloudRain, label: "Weather", view: "weather" },
    { icon: BarChart2, label: "Analytics", view: "analytics" },
    { icon: Wifi, label: "Network", view: "network" },
  ],
  traffic_police: [
    { icon: TrafficCone, label: "Signal Map", view: "signalmap" },
    { icon: List, label: "Priority Queue", view: "queue" },
    { icon: Settings, label: "Override", view: "override" },
    { icon: MapIcon, label: "Corridor Tool", view: "corridor" },
    { icon: AlertTriangle, label: "Incidents", view: "incidents" },
    { icon: BookOpen, label: "Logs", view: "logs" },
  ],
  driver: [
    { icon: Ambulance, label: "Mission", view: "mission" },
    { icon: Navigation, label: "Navigation", view: "navigation" },
    { icon: Users2, label: "Convoy", view: "convoy" },
    { icon: HeartPulse, label: "Vehicle Health", view: "health" },
    { icon: MapIcon, label: "Routes", view: "routes" },
  ],
  hospital_staff: [
    { icon: HeartPulse, label: "Bed Status", view: "beds" },
    { icon: Ambulance, label: "Arrivals", view: "arrivals" },
    { icon: FileText, label: "Patient Data", view: "patientdata" },
    { icon: Navigation, label: "Helipad", view: "helipad" },
    { icon: ClipboardList, label: "Schedule", view: "schedule" },
  ],
  field_technician: [
    { icon: ClipboardList, label: "Work Orders", view: "workorders" },
    { icon: Activity, label: "Diagnostics", view: "diagnostics" },
    { icon: Wrench, label: "Maintenance", view: "maintenance" },
    { icon: Package, label: "Inventory", view: "inventory" },
    { icon: MapIcon, label: "Map", view: "techmap" },
  ],
  citizen: [
    { icon: Bell, label: "Alerts", view: "alerts" },
    { icon: MapIcon, label: "Map", view: "publicmap" },
    { icon: Trophy, label: "Leaderboard", view: "leaderboard" },
    { icon: Flag, label: "Report", view: "report" },
  ],
  admin: [
    { icon: Users2, label: "Users", view: "users" },
    { icon: Settings, label: "Settings", view: "settings" },
    { icon: BookOpen, label: "Audit Log", view: "auditlog" },
    { icon: Shield, label: "Compliance", view: "compliance" },
    { icon: Globe, label: "API Management", view: "apimgmt" },
    { icon: BarChart2, label: "Analytics", view: "analytics" },
  ],
  agency_admin: [
    { icon: MapIcon, label: "Command Map", view: "commandmap" },
    { icon: Truck, label: "Resources", view: "agencyresources" },
    { icon: MessageSquare, label: "Messaging", view: "messaging" },
    { icon: AlertTriangle, label: "Incidents", view: "agencyincidents" },
    { icon: BellRing, label: "Reports", view: "agencyreports" },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  tmc_operator: "TMC Operator",
  traffic_police: "Traffic Police",
  driver: "Driver",
  hospital_staff: "Hospital Staff",
  field_technician: "Field Technician",
  citizen: "Citizen",
  admin: "System Admin",
  agency_admin: "Agency Admin",
};

export function Sidebar() {
  const {
    user,
    activeView,
    setActiveView,
    sidebarOpen,
    toggleSidebar,
    setUser,
  } = useAppStore();
  if (!user) return null;
  const navItems = NAV_MAP[user.role] ?? [];

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${sidebarOpen ? "w-56" : "w-0 lg:w-14"} overflow-hidden flex-shrink-0`}
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <div
          className={`flex items-center gap-2 ${!sidebarOpen ? "lg:justify-center" : ""}`}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent-blue)" }}
          >
            <Ambulance size={16} color="white" />
          </div>
          {sidebarOpen && (
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              V2I System
            </span>
          )}
        </div>
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded"
            style={{ color: "var(--text-secondary)" }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Role Badge */}
      {sidebarOpen && (
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Logged in as
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {user.name}
          </p>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "var(--accent-blue)",
              color: "#fff",
              fontSize: 10,
            }}
          >
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
        {navItems.map((item) => (
          <div
            key={item.view}
            className={`sidebar-item ${activeView === item.view ? "active" : ""}`}
            onClick={() => setActiveView(item.view)}
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon size={17} className="flex-shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
            {sidebarOpen && activeView === item.view && (
              <ChevronRight size={14} className="ml-auto" />
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        className="p-2"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <button
          onClick={() => setUser(null)}
          className="sidebar-item w-full text-left"
          style={{ color: "var(--accent-red)" }}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
