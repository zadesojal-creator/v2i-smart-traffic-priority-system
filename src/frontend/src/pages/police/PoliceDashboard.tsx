import { AlertTriangle, Download, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { PriorityQueue } from "../../components/common/PriorityQueue";
import { StatusBadge } from "../../components/common/StatusBadge";
import { TrafficMap } from "../../components/map/TrafficMap";
import {
  generateAuditLogs,
  generatePriorityRequests,
  generateSignals,
} from "../../data/mockData";
import { generateIncidents } from "../../data/mockData";
import { useAppStore } from "../../store/appStore";
import type { TrafficSignal } from "../../types";

const TABS = [
  "Signal Map",
  "Priority Queue",
  "Override",
  "Corridor",
  "Logs",
] as const;
type Tab = (typeof TABS)[number];

export function PoliceDashboard() {
  const {
    setSignals,
    signals,
    priorityRequests,
    addPriorityRequest,
    setIncidents,
  } = useAppStore();
  const [tab, setTab] = useState<Tab>("Signal Map");
  const [selectedSignal, setSelectedSignal] = useState<TrafficSignal | null>(
    null,
  );
  const [corridorSignals, setCorridorSignals] = useState<string[]>([]);
  const [logs] = useState(generateAuditLogs());
  const [overrideSignal, setOverrideSignal] = useState<TrafficSignal | null>(
    null,
  );

  useEffect(() => {
    setSignals(generateSignals());
    setIncidents(generateIncidents());
    const reqs = generatePriorityRequests();
    reqs.forEach((r) => addPriorityRequest(r));
    const t = setInterval(() => setSignals(generateSignals()), 10000);
    return () => clearInterval(t);
  }, []);

  const handleSignalClick = (id: string) => {
    const s = signals.find((sig) => sig.id === id);
    if (s) setSelectedSignal(s);
  };

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
        {tab === "Signal Map" && (
          <div className="flex gap-4" style={{ height: "65vh" }}>
            <div className="flex-1 card overflow-hidden">
              <TrafficMap
                signals={signals}
                onSignalClick={handleSignalClick}
                height="100%"
              />
            </div>
            {selectedSignal && (
              <div className="w-64 card p-4 flex-shrink-0 overflow-y-auto scrollbar-thin">
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Signal Details
                </h3>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {selectedSignal.name}
                </p>
                <StatusBadge status={selectedSignal.status} />
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-muted)" }}>Battery</span>
                    <span style={{ color: "var(--text-primary)" }}>
                      {selectedSignal.battery}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-muted)" }}>Solar</span>
                    <span style={{ color: "var(--text-primary)" }}>
                      {selectedSignal.solar}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-muted)" }}>
                      Last Activation
                    </span>
                    <span style={{ color: "var(--text-primary)" }}>
                      {selectedSignal.lastActivation}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    className="w-full py-2 text-xs rounded-lg font-semibold"
                    style={{ background: "var(--accent-blue)", color: "#fff" }}
                  >
                    Override Signal
                  </button>
                  <button
                    className="w-full py-2 text-xs rounded-lg font-semibold"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    View Camera Feed
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "Priority Queue" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                [
                  "Pending",
                  priorityRequests.filter((r) => r.status === "pending").length,
                  "#ff9800",
                ],
                [
                  "Active",
                  priorityRequests.filter((r) => r.status === "active").length,
                  "#00a8ff",
                ],
                [
                  "Completed Today",
                  priorityRequests.filter((r) => r.status === "completed")
                    .length,
                  "#00c853",
                ],
              ].map(([label, val, color]) => (
                <div
                  key={label as string}
                  className="kpi-card"
                  style={{ borderTop: `3px solid ${color}` }}
                >
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: color as string }}
                  >
                    {val}
                  </p>
                </div>
              ))}
            </div>
            <div className="card p-4">
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Live Priority Queue
              </h3>
              <PriorityQueue
                requests={priorityRequests}
                showActions={true}
                maxRows={15}
              />
            </div>
          </div>
        )}

        {tab === "Override" && (
          <div className="space-y-4">
            <div
              className="p-3 rounded-lg flex items-center gap-2"
              style={{
                background: "rgba(255,152,0,0.1)",
                border: "1px solid rgba(255,152,0,0.3)",
              }}
            >
              <AlertTriangle
                size={16}
                style={{ color: "var(--accent-amber)" }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--accent-amber)" }}
              >
                Manual override mode — changes take effect immediately.
                Authorized personnel only.
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {signals.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  onClick={() => setOverrideSignal(s)}
                  className="card p-3 cursor-pointer hover:card-glow transition-all"
                  style={{
                    borderLeft: `3px solid ${overrideSignal?.id === s.id ? "var(--accent-blue)" : "transparent"}`,
                  }}
                >
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.name.split(" & ")[0]}
                  </p>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
            {overrideSignal && (
              <div className="card p-4">
                <h3
                  className="text-sm font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Override: {overrideSignal.name}
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    {
                      label: "Green Duration",
                      key: "greenDuration",
                      color: "#00c853",
                    },
                    {
                      label: "Yellow Duration",
                      key: "yellowDuration",
                      color: "#ff9800",
                    },
                    {
                      label: "Red Duration",
                      key: "redDuration",
                      color: "#ff3b3b",
                    },
                  ].map((item) => (
                    <div key={item.key}>
                      <p className="text-xs mb-2" style={{ color: item.color }}>
                        {item.label}
                      </p>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={3}
                          max={120}
                          defaultValue={
                            overrideSignal[
                              item.key as keyof TrafficSignal
                            ] as number
                          }
                          className="flex-1 accent-blue-500"
                        />
                        <span
                          className="text-sm font-bold w-8"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {overrideSignal[item.key as keyof TrafficSignal]}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-4 py-2 text-sm rounded-lg font-semibold"
                    style={{ background: "var(--accent-red)", color: "#fff" }}
                  >
                    Apply Override
                  </button>
                  <button
                    onClick={() => setOverrideSignal(null)}
                    className="px-4 py-2 text-sm rounded-lg font-semibold"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "Corridor" && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Select intersections to create an emergency signal corridor.
              Selected signals will be synchronized for green waves.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {signals.slice(0, 12).map((s) => {
                const selected = corridorSignals.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() =>
                      setCorridorSignals((prev) =>
                        selected
                          ? prev.filter((id) => id !== s.id)
                          : [...prev, s.id],
                      )
                    }
                    className="card p-3 cursor-pointer transition-all"
                    style={{
                      borderColor: selected
                        ? "var(--accent-blue)"
                        : "var(--border-color)",
                      background: selected
                        ? "rgba(0,168,255,0.1)"
                        : "var(--bg-card)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border flex items-center justify-center"
                        style={{
                          borderColor: selected
                            ? "var(--accent-blue)"
                            : "var(--border-color)",
                          background: selected
                            ? "var(--accent-blue)"
                            : "transparent",
                        }}
                      >
                        {selected && (
                          <span className="text-white text-xs">
                            {corridorSignals.indexOf(s.id) + 1}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {s.name.split(" & ")[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {corridorSignals.length > 1 && (
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 p-3 rounded-lg"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Corridor: {corridorSignals.length} signals selected
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-sm rounded-lg font-semibold pulse-blue"
                  style={{ background: "var(--accent-blue)", color: "#fff" }}
                >
                  Activate Corridor
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "Logs" && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Priority Request Audit Log
              </h3>
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <Download size={12} /> Export CSV
              </button>
            </div>
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
                      "Time",
                      "User",
                      "Role",
                      "Action",
                      "Details",
                      "Result",
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
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-white/5"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <td
                        className="py-2 px-3 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {log.timestamp.toLocaleTimeString()}
                      </td>
                      <td
                        className="py-2 px-3 text-xs"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {log.user}
                      </td>
                      <td
                        className="py-2 px-3 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {log.role}
                      </td>
                      <td
                        className="py-2 px-3 text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {log.action}
                      </td>
                      <td
                        className="py-2 px-3 text-xs"
                        style={{ color: "var(--text-muted)", maxWidth: 200 }}
                      >
                        {log.details.slice(0, 50)}
                      </td>
                      <td className="py-2 px-3">
                        <StatusBadge status={log.result} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
