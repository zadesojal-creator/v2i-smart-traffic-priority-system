import { Clock, HeartPulse, Plane, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/common/StatusBadge";
import {
  HOSPITALS,
  generateHospitalBeds,
  generateVehicles,
} from "../../data/mockData";
import type { HospitalBed } from "../../types";

const TABS = [
  "Bed Status",
  "Arrivals",
  "Patient Data",
  "Helipad",
  "Schedule",
] as const;
type Tab = (typeof TABS)[number];

export function HospitalDashboard() {
  const [tab, setTab] = useState<Tab>("Bed Status");
  const [beds, setBeds] = useState<HospitalBed[]>(generateHospitalBeds());
  const [arrivals] = useState(
    generateVehicles().filter((v) => v.status === "on_mission"),
  );
  const [helipadsAvailable, setHelipadsAvailable] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBeds(generateHospitalBeds()), 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex gap-1 px-4 pt-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium"
            style={{
              color: tab === t ? "var(--accent-blue)" : "var(--text-secondary)",
              borderBottom:
                tab === t
                  ? "2px solid var(--accent-blue)"
                  : "2px solid transparent",
              background: "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {tab === "Bed Status" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {beds.map((b) => {
                const pct = (b.available / b.total) * 100;
                const color =
                  pct > 40 ? "#00c853" : pct > 20 ? "#ff9800" : "#ff3b3b";
                return (
                  <div
                    key={b.category}
                    className="card p-4"
                    style={{ borderTop: `4px solid ${color}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {b.category}
                      </h3>
                      <span className="text-2xl font-bold" style={{ color }}>
                        {b.available}
                      </span>
                    </div>
                    <p
                      className="text-xs mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Available of {b.total} total
                    </p>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ background: "var(--border-color)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <div
                      className="flex justify-between text-xs mt-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>Reserved: {b.reserved}</span>
                      <span>
                        Occupied: {b.total - b.available - b.reserved}
                      </span>
                    </div>
                    {/* Bed Grid */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {Array.from({ length: b.total }, (_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-sm"
                          style={{
                            background:
                              i < b.available
                                ? color
                                : i < b.available + b.reserved
                                  ? "#ff9800"
                                  : "var(--border-color)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "Arrivals" && (
          <div className="space-y-3">
            {arrivals.length === 0 && (
              <p style={{ color: "var(--text-muted)" }} className="text-sm">
                No incoming ambulances at this time.
              </p>
            )}
            {arrivals.map((v, i) => (
              <div
                key={v.id}
                className="card p-4"
                style={{ borderLeft: "3px solid var(--accent-red)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {v.callsign}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(255,59,59,0.15)",
                          color: "#ff3b3b",
                        }}
                      >
                        INCOMING
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Severity: {["Critical", "High", "Medium"][i % 3]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--accent-blue)" }}
                    >
                      {v.eta ?? 5}m
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ETA
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Prep Checklist:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Trauma Bay Ready",
                      "Blood Type O-",
                      "Surgeon On-Call",
                      "X-Ray Available",
                    ].map((item, j) => (
                      <div key={item} className="flex items-center gap-1">
                        <div
                          className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center"
                          style={{
                            borderColor:
                              j < 2
                                ? "var(--accent-green)"
                                : "var(--border-color)",
                            background:
                              j < 2 ? "var(--accent-green)" : "transparent",
                          }}
                        >
                          {j < 2 && (
                            <span
                              className="text-white"
                              style={{ fontSize: 8 }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Patient Data" && (
          <div className="card p-6 max-w-lg">
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Pre-Transmission Patient Data
            </h3>
            <div className="space-y-3">
              {[
                ["Patient Name", "text", "John Doe"],
                ["Age", "number", "45"],
                ["Blood Type", "text", "O+"],
                ["Allergies", "text", "Penicillin"],
                ["Chief Complaint", "text", "Chest pain, SOB"],
              ].map(([label, type, placeholder]) => (
                <div key={label as string}>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}
                  </label>
                  <input
                    type={type as string}
                    placeholder={placeholder as string}
                    className="w-full p-2 rounded-lg text-sm"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              ))}
              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Vitals (BP / HR / SpO2)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["120/80", "88", "98%"].map((placeholder, i) => (
                    <input
                      key={i}
                      placeholder={placeholder}
                      className="p-2 rounded-lg text-sm text-center"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--accent-blue)", color: "#fff" }}
              >
                <HeartPulse size={14} className="inline mr-2" />
                Send to ER Team
              </button>
            </div>
          </div>
        )}

        {tab === "Helipad" && (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <h3
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Helipad Status
                </h3>
                <div className="flex items-center gap-2">
                  <Plane size={18} style={{ color: "var(--accent-blue)" }} />
                  <button
                    onClick={() => setHelipadsAvailable(!helipadsAvailable)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${helipadsAvailable ? "bg-green-500" : "bg-gray-600"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${helipadsAvailable ? "left-6" : "left-0.5"}`}
                    />
                  </button>
                </div>
              </div>
              <p
                className="text-sm mt-2"
                style={{
                  color: helipadsAvailable
                    ? "var(--accent-green)"
                    : "var(--accent-red)",
                }}
              >
                {helipadsAvailable
                  ? "Helipad AVAILABLE - Clear for air ambulance"
                  : "Helipad OCCUPIED - Do not clear"}
              </p>
              <div
                className="mt-4 p-4 rounded-xl flex items-center justify-center"
                style={{
                  background: "var(--bg-primary)",
                  border: "2px dashed var(--border-color)",
                  minHeight: 120,
                }}
              >
                <div className="text-center">
                  <div
                    className="text-4xl font-bold"
                    style={{
                      color: helipadsAvailable
                        ? "var(--accent-green)"
                        : "#ff3b3b",
                      fontFamily: "monospace",
                    }}
                  >
                    H
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {helipadsAvailable ? "Clear" : "Occupied"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Schedule" && (
          <div className="card p-4">
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              On-Call Specialists
            </h3>
            <div className="space-y-2">
              {[
                {
                  name: "Dr. Sarah Chen",
                  spec: "Trauma Surgery",
                  status: "available",
                  eta: "5m",
                },
                {
                  name: "Dr. James Okafor",
                  spec: "Cardiology",
                  status: "on_mission",
                  eta: "25m",
                },
                {
                  name: "Dr. Maria Santos",
                  spec: "Neurology",
                  status: "available",
                  eta: "12m",
                },
                {
                  name: "Dr. Wei Zhang",
                  spec: "Emergency Medicine",
                  status: "available",
                  eta: "3m",
                },
                {
                  name: "Dr. Alex Murphy",
                  spec: "Orthopedics",
                  status: "offline",
                  eta: "45m",
                },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: "var(--accent-blue)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {doc.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {doc.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {doc.spec}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} style={{ color: "var(--text-muted)" }} />
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {doc.eta}
                    </span>
                    <StatusBadge status={doc.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
