import { useEffect } from "react";
import { MobileNav } from "./components/layout/MobileNav";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AgencyDashboard } from "./pages/agency/AgencyDashboard";
import { CitizenDashboard } from "./pages/citizen/CitizenDashboard";
import { DriverDashboard } from "./pages/driver/DriverDashboard";
import { HospitalDashboard } from "./pages/hospital/HospitalDashboard";
import { NetworkDashboard } from "./pages/network/NetworkDashboard";
import { PoliceDashboard } from "./pages/police/PoliceDashboard";
import { TechnicianDashboard } from "./pages/technician/TechnicianDashboard";
import { TMCDashboard } from "./pages/tmc/TMCDashboard";
import { useAppStore } from "./store/appStore";

const VIEW_TITLES: Record<string, string> = {
  overview: "TMC Overview",
  livemap: "Live Traffic Map",
  dispatch: "Dispatch Center",
  incidents: "Incident Management",
  resources: "Resources",
  analytics: "Analytics",
  network: "Network Status",
  weather: "Weather Overlay",
  signalmap: "Signal Control Map",
  queue: "Priority Queue",
  override: "Manual Override",
  corridor: "Corridor Tool",
  logs: "Audit Logs",
  mission: "Mission Control",
  navigation: "Navigation",
  convoy: "Convoy Mode",
  health: "Vehicle Health",
  routes: "Route Options",
  beds: "Bed Status",
  arrivals: "Incoming Arrivals",
  patientdata: "Patient Data",
  helipad: "Helipad",
  schedule: "Schedule",
  workorders: "Work Orders",
  diagnostics: "Diagnostics",
  maintenance: "Maintenance",
  inventory: "Inventory",
  techmap: "Technician Map",
  alerts: "Emergency Alerts",
  publicmap: "Public Map",
  leaderboard: "Leaderboard",
  report: "Report",
  users: "User Management",
  settings: "System Settings",
  auditlog: "Audit Log",
  compliance: "Compliance",
  apimgmt: "API Management",
  commandmap: "Command Map",
  agencyresources: "Agency Resources",
  messaging: "Secure Messaging",
  agencyincidents: "Agency Incidents",
  agencyreports: "Agency Reports",
};

function DashboardContent() {
  const { user, activeView } = useAppStore();
  if (!user) return null;

  if (activeView === "network") return <NetworkDashboard />;

  switch (user.role) {
    case "tmc_operator":
      return <TMCDashboard />;
    case "traffic_police":
      return <PoliceDashboard />;
    case "driver":
      return <DriverDashboard />;
    case "hospital_staff":
      return <HospitalDashboard />;
    case "field_technician":
      return <TechnicianDashboard />;
    case "citizen":
      return <CitizenDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "agency_admin":
      return <AgencyDashboard />;
    default:
      return <TMCDashboard />;
  }
}

export default function App() {
  const { user, theme, activeView } = useAppStore();
  const pageTitle = VIEW_TITLES[activeView] ?? "V2I Smart Traffic System";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={pageTitle} />
        <main
          className="flex-1 overflow-hidden"
          style={{ background: "var(--bg-primary)" }}
        >
          <DashboardContent />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
