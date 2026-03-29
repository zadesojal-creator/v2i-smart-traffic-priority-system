import { MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { TrafficMap } from "../../components/map/TrafficMap";
import {
  generateIncidents,
  generateMessages,
  generateVehicles,
} from "../../data/mockData";
import type { Incident, Message, Vehicle } from "../../types";

const TABS = ["Command Map", "Resources", "Messaging", "Incidents"] as const;
type Tab = (typeof TABS)[number];

export function AgencyDashboard() {
  const [tab, setTab] = useState<Tab>("Command Map");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [messages] = useState<Message[]>(generateMessages());
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    setVehicles(generateVehicles());
    setIncidents(generateIncidents());
    const t = setInterval(() => setVehicles(generateVehicles()), 5000);
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
        {tab === "Command Map" && (
          <div className="flex gap-4" style={{ height: "65vh" }}>
            <div className="flex-1 card overflow-hidden">
              <TrafficMap
                vehicles={vehicles}
                incidents={incidents}
                height="100%"
              />
            </div>
            <div className="w-56 card p-3 flex-shrink-0 overflow-y-auto scrollbar-thin">
              <h3
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                UNIT LEGEND
              </h3>
              {["ambulance", "fire", "police"].map((agency) => (
                <div key={agency} className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background:
                        agency === "ambulance"
                          ? "#ff3b3b"
                          : agency === "fire"
                            ? "#ff9800"
                            : "#00a8ff",
                    }}
                  />
                  <span
                    className="text-xs capitalize"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {agency}
                  </span>
                  <span
                    className="ml-auto text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {vehicles.filter((v) => v.agency === agency).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Resources" && (
          <div className="card p-4">
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Multi-Agency Resources
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {["Unit", "Agency", "Status", "Location", "Battery"].map(
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
                {vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-white/5"
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td
                      className="py-2 px-3 font-semibold text-xs"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {v.callsign}
                    </td>
                    <td
                      className="py-2 px-3 text-xs capitalize"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {v.agency}
                    </td>
                    <td className="py-2 px-3">
                      <StatusBadge status={v.status} />
                    </td>
                    <td
                      className="py-2 px-3 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {v.lat.toFixed(3)}, {v.lng.toFixed(3)}
                    </td>
                    <td
                      className="py-2 px-3 text-xs"
                      style={{ color: v.battery > 50 ? "#00c853" : "#ff9800" }}
                    >
                      {v.battery}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Messaging" && (
          <div className="card flex flex-col" style={{ height: "65vh" }}>
            <div
              className="flex items-center gap-2 p-3"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <MessageSquare
                size={16}
                style={{ color: "var(--accent-blue)" }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Secure Agency Channel
              </span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--accent-blue)", color: "#fff" }}
                  >
                    {msg.from[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {msg.from}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        [{msg.agency}]
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      className="inline-block p-2 rounded-lg text-sm"
                      style={{
                        background: "var(--bg-primary)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="p-3 flex gap-2"
              style={{ borderTop: "1px solid var(--border-color)" }}
            >
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a secure message..."
                className="flex-1 p-2 rounded-lg text-sm"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={() => setNewMsg("")}
                className="px-3 py-2 rounded-lg"
                style={{ background: "var(--accent-blue)", color: "#fff" }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {tab === "Incidents" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {incidents.map((inc) => {
              const sevColor =
                inc.severity >= 4
                  ? "#ff3b3b"
                  : inc.severity >= 3
                    ? "#ff9800"
                    : "#00c853";
              return (
                <div
                  key={inc.id}
                  className="card p-4"
                  style={{ borderLeft: `3px solid ${sevColor}` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: sevColor }}
                    >
                      {inc.type}
                    </span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {inc.address}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {inc.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Sev: {inc.severity}/5
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Units: {inc.assignedUnits.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
