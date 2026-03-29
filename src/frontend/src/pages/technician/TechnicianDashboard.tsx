import { AlertTriangle, Package, RefreshCw, Wrench } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { TrafficMap } from "../../components/map/TrafficMap";
import { generateSignals, generateWorkOrders } from "../../data/mockData";
import type { WorkOrder } from "../../types";

const TABS = [
  "Work Orders",
  "Diagnostics",
  "Maintenance",
  "Inventory",
  "Map",
] as const;
type Tab = (typeof TABS)[number];

const INVENTORY = [
  { name: "LED Module (Type A)", qty: 12, min: 10 },
  { name: "Controller Board v3", qty: 3, min: 5 },
  { name: "Battery Backup Unit", qty: 7, min: 5 },
  { name: "Solar Panel 100W", qty: 2, min: 4 },
  { name: "Traffic Camera", qty: 1, min: 3 },
  { name: "Signal Housing", qty: 15, min: 8 },
  { name: "Communication Module", qty: 0, min: 2 },
  { name: "Power Supply Unit", qty: 9, min: 5 },
];

export function TechnicianDashboard() {
  const [tab, setTab] = useState<Tab>("Work Orders");
  const [orders] = useState<WorkOrder[]>(generateWorkOrders());
  const signals = generateSignals();

  const grouped = {
    open: orders.filter((o) => o.status === "open"),
    in_progress: orders.filter((o) => o.status === "in_progress"),
    completed: orders.filter((o) => o.status === "completed"),
  };

  const priorityColor = (p: string) =>
    p === "critical"
      ? "#ff3b3b"
      : p === "high"
        ? "#ff9800"
        : p === "medium"
          ? "#00a8ff"
          : "#00c853";

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
        {tab === "Work Orders" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["open", "in_progress", "completed"] as const).map((status) => (
              <div key={status} className="card p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {status === "in_progress"
                      ? "In Progress"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--bg-primary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {grouped[status].length}
                  </span>
                </div>
                <div className="space-y-2">
                  {grouped[status].map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-lg"
                      style={{
                        background: "var(--bg-primary)",
                        border: `1px solid ${priorityColor(o.priority)}33`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs font-bold"
                          style={{ color: priorityColor(o.priority) }}
                        >
                          {o.priority.toUpperCase()}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          #{o.id}
                        </span>
                      </div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {o.issueType}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {o.signalName.split(" & ")[0]}
                      </p>
                      <div className="mt-2">
                        {status === "open" && (
                          <button
                            className="w-full py-1 text-xs rounded"
                            style={{
                              background: "var(--accent-blue)",
                              color: "#fff",
                            }}
                          >
                            Accept
                          </button>
                        )}
                        {status === "in_progress" && (
                          <button
                            className="w-full py-1 text-xs rounded"
                            style={{
                              background: "var(--accent-green)",
                              color: "#fff",
                            }}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Diagnostics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {signals.slice(0, 9).map((s) => (
              <div key={s.id} className="card p-3">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.name.split(" & ")[0]}
                  </span>
                  <StatusBadge status={s.status} />
                </div>
                <div className="space-y-2">
                  <div>
                    <div
                      className="flex justify-between text-xs mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>Battery</span>
                      <span>{s.battery}%</span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{ background: "var(--border-color)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.battery}%`,
                          background: s.battery > 50 ? "#00c853" : "#ff9800",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div
                      className="flex justify-between text-xs mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>Solar</span>
                      <span>{s.solar}%</span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{ background: "var(--border-color)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s.solar}%`, background: "#ff9800" }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="mt-2 w-full py-1 text-xs rounded flex items-center justify-center gap-1"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <RefreshCw size={10} /> Remote Reset
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "Maintenance" && (
          <div className="space-y-3">
            {[
              {
                signal: "Main St & 5th Ave",
                issue: "Battery backup below 30%",
                urgency: "critical",
                eta: "2 days",
              },
              {
                signal: "Broadway & 42nd",
                issue: "Solar panel output degraded",
                urgency: "high",
                eta: "5 days",
              },
              {
                signal: "Park Ave & 34th",
                issue: "Controller firmware update pending",
                urgency: "medium",
                eta: "14 days",
              },
              {
                signal: "Canal & Varick",
                issue: "LED module flickering",
                urgency: "high",
                eta: "3 days",
              },
              {
                signal: "7th Ave & 14th",
                issue: "Communication latency increased",
                urgency: "medium",
                eta: "7 days",
              },
            ].map((alert) => (
              <div
                key={alert.signal}
                className="card p-4 flex items-start justify-between"
                style={{
                  borderLeft: `3px solid ${priorityColor(alert.urgency)}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={16}
                    style={{
                      color: priorityColor(alert.urgency),
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {alert.signal}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {alert.issue}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={alert.urgency} />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Due: {alert.eta}
                  </p>
                  <button
                    className="mt-1 px-2 py-0.5 text-xs rounded"
                    style={{ background: "var(--accent-blue)", color: "#fff" }}
                  >
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Inventory" && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Spare Parts Inventory
              </h3>
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg"
                style={{ background: "var(--accent-blue)", color: "#fff" }}
              >
                <Package size={12} /> Request Restock
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {["Part Name", "In Stock", "Min Required", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-xs font-medium"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map((item) => {
                  const low = item.qty < item.min;
                  return (
                    <tr
                      key={item.name}
                      className="hover:bg-white/5"
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        background:
                          item.qty === 0
                            ? "rgba(255,59,59,0.05)"
                            : "transparent",
                      }}
                    >
                      <td
                        className="py-2 px-3 text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.name}
                      </td>
                      <td
                        className="py-2 px-3 text-sm font-bold"
                        style={{ color: low ? "#ff3b3b" : "#00c853" }}
                      >
                        {item.qty}
                      </td>
                      <td
                        className="py-2 px-3 text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.min}
                      </td>
                      <td className="py-2 px-3">
                        <StatusBadge
                          status={
                            item.qty === 0
                              ? "fault"
                              : low
                                ? "maintenance"
                                : "normal"
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Map" && (
          <div className="card overflow-hidden" style={{ height: "65vh" }}>
            <TrafficMap signals={signals} height="100%" />
          </div>
        )}
      </div>
    </div>
  );
}
