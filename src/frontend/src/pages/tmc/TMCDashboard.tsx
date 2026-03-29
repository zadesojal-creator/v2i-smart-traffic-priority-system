import {
  Activity,
  AlertTriangle,
  BarChart2,
  Clock,
  Eye,
  MapPin,
  Radio,
  Truck,
  Wifi,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  ReAreaChart,
  ReDonutChart,
  ReLineChart,
} from "../../components/charts/Charts";
import { KPICard } from "../../components/common/KPICard";
import { PriorityQueue } from "../../components/common/PriorityQueue";
import { StatusBadge } from "../../components/common/StatusBadge";
import { TrafficMap } from "../../components/map/TrafficMap";
import {
  generateHourlyData,
  generateIncidents,
  generatePriorityRequests,
  generateResponseTimeData,
  generateSignals,
  generateVehicles,
} from "../../data/mockData";
import { useAppStore } from "../../store/appStore";
import type { Incident, Vehicle } from "../../types";

const TABS = [
  "Overview",
  "Live Map",
  "Dispatch",
  "Incidents",
  "Resources",
  "Analytics",
] as const;
type Tab = (typeof TABS)[number];

export function TMCDashboard() {
  const {
    setVehicles,
    setSignals,
    addPriorityRequest,
    setIncidents,
    vehicles,
    signals,
    priorityRequests,
    incidents,
  } = useAppStore();
  const [tab, setTab] = useState<Tab>("Overview");
  const [rtData, setRtData] = useState(generateResponseTimeData(14));
  const [hourly, setHourly] = useState(generateHourlyData());

  const refresh = useCallback(() => {
    setVehicles(generateVehicles());
    setSignals(generateSignals());
    setIncidents(generateIncidents());
  }, [setVehicles, setSignals, setIncidents]);

  useEffect(() => {
    refresh();
    const t1 = setInterval(() => {
      setVehicles(generateVehicles());
    }, 4000);
    const t2 = setInterval(() => {
      const reqs = generatePriorityRequests();
      reqs.slice(0, 2).forEach((r) => addPriorityRequest(r));
    }, 12000);
    const t3 = setInterval(() => {
      setRtData(generateResponseTimeData(14));
      setHourly(generateHourlyData());
    }, 8000);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
      clearInterval(t3);
    };
  }, [refresh, addPriorityRequest]);

  const activeMissions = vehicles.filter(
    (v) => v.status === "on_mission",
  ).length;
  const pendingRequests = priorityRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const openIncidents = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div
        className="flex gap-1 px-4 pt-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
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
        {tab === "Overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <KPICard
                title="Active Vehicles"
                value={vehicles.length}
                icon={Truck}
                iconColor="#00a8ff"
                trend={2}
                borderColor="#00a8ff"
              />
              <KPICard
                title="On Mission"
                value={activeMissions}
                icon={Truck}
                iconColor="#ff3b3b"
                borderColor="#ff3b3b"
              />
              <KPICard
                title="Pending Requests"
                value={pendingRequests}
                icon={Radio}
                iconColor="#ff9800"
                borderColor="#ff9800"
              />
              <KPICard
                title="Avg Response"
                value="7.3m"
                subtitle="Target: 8m"
                icon={Clock}
                iconColor="#00c853"
                trend={-5}
                borderColor="#00c853"
              />
              <KPICard
                title="Active Incidents"
                value={openIncidents}
                icon={AlertTriangle}
                iconColor="#ff3b3b"
                borderColor="#ff3b3b"
              />
              <KPICard
                title="Network Health"
                value="99.7%"
                icon={Wifi}
                iconColor="#00c853"
                borderColor="#00c853"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 card p-4">
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Priority Request Queue
                </h3>
                <PriorityQueue requests={priorityRequests} maxRows={8} />
              </div>
              <div className="card p-4">
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Incident Types
                </h3>
                <ReDonutChart
                  data={[
                    { name: "Medical", value: 12 },
                    { name: "Accident", value: 8 },
                    { name: "Fire", value: 5 },
                    { name: "Roadblock", value: 4 },
                    { name: "Weather", value: 3 },
                  ]}
                  height={200}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card p-4">
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Response Time Trend (14 days)
                </h3>
                <ReLineChart
                  data={rtData}
                  lines={[
                    { key: "actual", color: "#00a8ff", name: "Actual (min)" },
                    {
                      key: "estimated",
                      color: "#00c853",
                      name: "Estimated (min)",
                    },
                    { key: "target", color: "#ff9800", name: "Target" },
                  ]}
                />
              </div>
              <div className="card p-4">
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Hourly Activity
                </h3>
                <ReAreaChart
                  data={hourly.slice(6, 22)}
                  areas={[
                    {
                      key: "requests",
                      color: "#00a8ff",
                      name: "Priority Requests",
                    },
                    { key: "incidents", color: "#ff3b3b", name: "Incidents" },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {tab === "Live Map" && (
          <div className="flex gap-4 h-full" style={{ minHeight: "60vh" }}>
            <div
              className="flex-1 card overflow-hidden"
              style={{ minHeight: 400 }}
            >
              <TrafficMap
                vehicles={vehicles}
                signals={signals}
                incidents={incidents}
                height="100%"
              />
            </div>
            <div className="w-64 card p-3 overflow-y-auto scrollbar-thin flex-shrink-0">
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Active Vehicles
              </h3>
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-2 rounded-lg"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {v.callsign}
                      </span>
                      <StatusBadge status={v.status} />
                    </div>
                    <div
                      className="mt-1 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Bat: {v.battery}% · {v.speed}km/h
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Dispatch" && <DispatchTab vehicles={vehicles} />}
        {tab === "Incidents" && <IncidentsTab incidents={incidents} />}
        {tab === "Resources" && <ResourcesTab vehicles={vehicles} />}
        {tab === "Analytics" && (
          <AnalyticsTab rtData={rtData} hourly={hourly} />
        )}
      </div>
    </div>
  );
}

function DispatchTab({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Resource Allocation
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                {[
                  "Callsign",
                  "Status",
                  "Battery",
                  "Speed",
                  "Location",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 text-xs font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="hover:bg-white/5"
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <td
                    className="py-2 px-3 font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {v.callsign}
                  </td>
                  <td className="py-2 px-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-16 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--border-color)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${v.battery}%`,
                            background:
                              v.battery > 50
                                ? "#00c853"
                                : v.battery > 20
                                  ? "#ff9800"
                                  : "#ff3b3b",
                          }}
                        />
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {v.battery}%
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-2 px-3 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {v.speed} km/h
                  </td>
                  <td
                    className="py-2 px-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {v.lat.toFixed(4)}, {v.lng.toFixed(4)}
                  </td>
                  <td className="py-2 px-3">
                    {v.status === "available" && (
                      <button
                        className="px-3 py-1 text-xs rounded font-semibold"
                        style={{
                          background: "var(--accent-blue)",
                          color: "#fff",
                        }}
                      >
                        Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card p-4">
        <h3
          className="text-sm font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Route Optimization
        </h3>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 p-3 rounded-lg"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Optimal route calculated: Main St → Broadway → 5th Ave via Park
              Ave. Estimated time saving:{" "}
              <span style={{ color: "var(--accent-green)" }}>2.3 min</span>
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--accent-green)", color: "#fff" }}
          >
            Apply Route
          </button>
        </div>
      </div>
    </div>
  );
}

function IncidentsTab({ incidents }: { incidents: Incident[] }) {
  const sevColor = (s: number) =>
    s >= 4 ? "#ff3b3b" : s >= 3 ? "#ff9800" : "#00c853";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {incidents.map((inc) => (
        <div
          key={inc.id}
          className="card p-4"
          style={{ borderLeft: `3px solid ${sevColor(inc.severity)}` }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <span
                className="text-xs font-bold uppercase"
                style={{ color: sevColor(inc.severity) }}
              >
                {inc.type}
              </span>
              <p
                className="text-sm font-medium mt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {inc.address}
              </p>
            </div>
            <StatusBadge status={inc.status} />
          </div>
          <p
            className="text-xs mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {inc.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background:
                      i < inc.severity
                        ? sevColor(inc.severity)
                        : "var(--border-color)",
                  }}
                />
              ))}
              <span
                className="text-xs ml-1"
                style={{ color: "var(--text-muted)" }}
              >
                Sev {inc.severity}
              </span>
            </div>
            <button
              className="px-2 py-1 text-xs rounded"
              style={{ background: "var(--accent-blue)", color: "#fff" }}
            >
              Assign Unit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourcesTab({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      {vehicles.map((v) => (
        <div
          key={v.id}
          className="card p-4"
          style={{
            borderTop: `3px solid ${v.status === "on_mission" ? "#ff3b3b" : v.status === "available" ? "#00c853" : "#ff9800"}`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Truck size={16} style={{ color: "var(--accent-blue)" }} />
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {v.callsign}
            </span>
          </div>
          <StatusBadge status={v.status} />
          <div className="mt-3 space-y-1.5">
            <div>
              <div
                className="flex justify-between text-xs mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                <span>Battery</span>
                <span>{v.battery}%</span>
              </div>
              <div
                className="w-full h-1.5 rounded-full"
                style={{ background: "var(--border-color)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${v.battery}%`,
                    background: v.battery > 50 ? "#00c853" : "#ff9800",
                  }}
                />
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Speed: {v.speed} km/h
            </p>
            {v.eta && (
              <p className="text-xs" style={{ color: "var(--accent-amber)" }}>
                ETA: {v.eta} min
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab({
  rtData,
  hourly,
}: { rtData: object[]; hourly: object[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          title="Total Missions"
          value="1,247"
          icon={Truck}
          iconColor="#00a8ff"
          trend={12}
        />
        <KPICard
          title="Avg Response"
          value="7.3 min"
          icon={Clock}
          iconColor="#00c853"
          trend={-8}
        />
        <KPICard
          title="CO₂ Saved"
          value="2.4 t"
          icon={Activity}
          iconColor="#00c853"
          trend={15}
        />
        <KPICard
          title="Success Rate"
          value="97.2%"
          icon={Zap}
          iconColor="#00c853"
          trend={2}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Response Time Trend
          </h3>
          <ReLineChart
            data={rtData}
            lines={[
              { key: "actual", color: "#00a8ff", name: "Actual (min)" },
              { key: "target", color: "#ff9800", name: "Target" },
            ]}
          />
        </div>
        <div className="card p-4">
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Hourly Priority Requests
          </h3>
          <ReAreaChart
            data={hourly}
            areas={[{ key: "requests", color: "#00a8ff", name: "Requests" }]}
          />
        </div>
      </div>
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Export Report
          </h3>
          <div className="flex gap-2">
            {["CSV", "PDF", "Excel"].map((fmt) => (
              <button
                key={fmt}
                className="px-3 py-1.5 text-xs rounded-lg font-semibold"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <MapPin size={12} className="inline mr-1" />
                {fmt}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Total Priority Requests", "4,821"],
            ["Avg Signal Wait Reduced", "43%"],
            ["Fuel Saved", "18,340 L"],
            ["Lives Impacted", "1,247"],
            ["Uptime", "99.7%"],
            ["ROI", "$2.4M"],
          ].map(([label, val]) => (
            <div
              key={label}
              className="p-3 rounded-lg"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {label}
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--accent-blue)" }}
              >
                {val}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
