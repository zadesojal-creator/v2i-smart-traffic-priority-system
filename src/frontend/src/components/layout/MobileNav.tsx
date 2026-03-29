import {
  AlertTriangle,
  Bell,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
} from "lucide-react";
import { useAppStore } from "../../store/appStore";
import type { Role } from "../../types";

const MOBILE_NAV: Record<
  Role,
  { icon: React.ElementType; label: string; view: string }[]
> = {
  tmc_operator: [
    { icon: LayoutDashboard, label: "Overview", view: "overview" },
    { icon: MapIcon, label: "Map", view: "livemap" },
    { icon: AlertTriangle, label: "Incidents", view: "incidents" },
    { icon: Bell, label: "Network", view: "network" },
    { icon: Settings, label: "Analytics", view: "analytics" },
  ],
  traffic_police: [
    { icon: MapIcon, label: "Signals", view: "signalmap" },
    { icon: LayoutDashboard, label: "Queue", view: "queue" },
    { icon: Settings, label: "Override", view: "override" },
    { icon: AlertTriangle, label: "Incidents", view: "incidents" },
    { icon: Bell, label: "Logs", view: "logs" },
  ],
  driver: [
    { icon: LayoutDashboard, label: "Mission", view: "mission" },
    { icon: MapIcon, label: "Nav", view: "navigation" },
    { icon: Bell, label: "Routes", view: "routes" },
    { icon: AlertTriangle, label: "Convoy", view: "convoy" },
    { icon: Settings, label: "Health", view: "health" },
  ],
  hospital_staff: [
    { icon: Bell, label: "Beds", view: "beds" },
    { icon: MapIcon, label: "Arrivals", view: "arrivals" },
    { icon: LayoutDashboard, label: "Patients", view: "patientdata" },
    { icon: AlertTriangle, label: "Helipad", view: "helipad" },
    { icon: Settings, label: "Schedule", view: "schedule" },
  ],
  field_technician: [
    { icon: LayoutDashboard, label: "Orders", view: "workorders" },
    { icon: MapIcon, label: "Map", view: "techmap" },
    { icon: AlertTriangle, label: "Alerts", view: "maintenance" },
    { icon: Bell, label: "Diag", view: "diagnostics" },
    { icon: Settings, label: "Inventory", view: "inventory" },
  ],
  citizen: [
    { icon: Bell, label: "Alerts", view: "alerts" },
    { icon: MapIcon, label: "Map", view: "publicmap" },
    { icon: AlertTriangle, label: "Report", view: "report" },
    { icon: LayoutDashboard, label: "Rank", view: "leaderboard" },
    { icon: Settings, label: "Settings", view: "citizen_settings" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Users", view: "users" },
    { icon: Bell, label: "Audit", view: "auditlog" },
    { icon: Settings, label: "Settings", view: "settings" },
    { icon: AlertTriangle, label: "Compliance", view: "compliance" },
    { icon: MapIcon, label: "API", view: "apimgmt" },
  ],
  agency_admin: [
    { icon: MapIcon, label: "Map", view: "commandmap" },
    { icon: LayoutDashboard, label: "Resources", view: "agencyresources" },
    { icon: Bell, label: "Messages", view: "messaging" },
    { icon: AlertTriangle, label: "Incidents", view: "agencyincidents" },
    { icon: Settings, label: "Reports", view: "agencyreports" },
  ],
};

export function MobileNav() {
  const { user, activeView, setActiveView } = useAppStore();
  if (!user) return null;
  const items = MOBILE_NAV[user.role] ?? [];

  return (
    <nav
      className="flex md:hidden flex-shrink-0"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => setActiveView(item.view)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors"
          style={{
            color:
              activeView === item.view
                ? "var(--accent-blue)"
                : "var(--text-secondary)",
          }}
        >
          <item.icon size={20} />
          <span style={{ fontSize: 10 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
