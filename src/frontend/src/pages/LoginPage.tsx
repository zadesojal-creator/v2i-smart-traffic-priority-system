import {
  Ambulance,
  Building2,
  Car,
  HeartPulse,
  Settings,
  Shield,
  Users2,
  Wrench,
} from "lucide-react";
import { useAppStore } from "../store/appStore";
import type { Role, User } from "../types";

const ROLES: {
  role: Role;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    role: "tmc_operator",
    label: "TMC Operator",
    desc: "Traffic Management Center",
    icon: Settings,
    color: "#00a8ff",
  },
  {
    role: "traffic_police",
    label: "Traffic Police",
    desc: "Signal Control & Override",
    icon: Shield,
    color: "#ff9800",
  },
  {
    role: "driver",
    label: "Emergency Driver",
    desc: "Ambulance / EV Driver",
    icon: Ambulance,
    color: "#ff3b3b",
  },
  {
    role: "hospital_staff",
    label: "Hospital Staff",
    desc: "Patient & Bed Management",
    icon: HeartPulse,
    color: "#00c853",
  },
  {
    role: "field_technician",
    label: "Field Technician",
    desc: "Maintenance & Diagnostics",
    icon: Wrench,
    color: "#9c27b0",
  },
  {
    role: "citizen",
    label: "Citizen / Driver",
    desc: "Alerts & Public Access",
    icon: Car,
    color: "#00bcd4",
  },
  {
    role: "admin",
    label: "System Admin",
    desc: "Full System Control",
    icon: Users2,
    color: "#e91e63",
  },
  {
    role: "agency_admin",
    label: "Agency Admin",
    desc: "Multi-Agency Coordination",
    icon: Building2,
    color: "#607d8b",
  },
];

const ROLE_NAMES: Record<Role, string> = {
  tmc_operator: "Alex Thompson",
  traffic_police: "Officer Martinez",
  driver: "Driver Johnson",
  hospital_staff: "Dr. Chen",
  field_technician: "Tech Wang",
  citizen: "Jane Doe",
  admin: "Admin User",
  agency_admin: "Chief Rodriguez",
};

export function LoginPage() {
  const { setUser } = useAppStore();

  const login = (role: Role) => {
    const user: User = {
      id: Math.random().toString(36).slice(2),
      name: ROLE_NAMES[role],
      role,
    };
    setUser(user);
    document.documentElement.setAttribute("data-theme", "dark");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--accent-blue)",
              boxShadow: "0 0 30px rgba(0,168,255,0.4)",
            }}
          >
            <Ambulance size={28} color="white" />
          </div>
          <div className="text-left">
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              V2I Smart Traffic
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Signal Priority System
            </p>
          </div>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Select your role to enter the demo environment
        </p>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full">
        {ROLES.map((r) => (
          <button
            key={r.role}
            onClick={() => login(r.role)}
            className="card p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-white/5 transition-all text-center group"
            style={{ borderTop: `3px solid ${r.color}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${r.color}20`, color: r.color }}
            >
              <r.icon size={20} />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {r.label}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {r.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
        Demo mode — click any role to enter the system
      </p>
    </div>
  );
}
