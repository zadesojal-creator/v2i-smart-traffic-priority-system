import { Download, Globe, Plus, Shield } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { generateAuditLogs } from "../../data/mockData";

const TABS = [
  "Users",
  "Settings",
  "Audit Log",
  "Compliance",
  "API Management",
] as const;
type Tab = (typeof TABS)[number];

const USERS = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex@v2i.city",
    role: "tmc_operator",
    lastLogin: "2 min ago",
    status: "active",
  },
  {
    id: 2,
    name: "Officer Martinez",
    email: "martinez@police.city",
    role: "traffic_police",
    lastLogin: "15 min ago",
    status: "active",
  },
  {
    id: 3,
    name: "Driver Johnson",
    email: "johnson@ems.city",
    role: "driver",
    lastLogin: "1 hr ago",
    status: "active",
  },
  {
    id: 4,
    name: "Dr. Chen",
    email: "chen@hospital.city",
    role: "hospital_staff",
    lastLogin: "30 min ago",
    status: "active",
  },
  {
    id: 5,
    name: "Tech Wang",
    email: "wang@maint.city",
    role: "field_technician",
    lastLogin: "3 hr ago",
    status: "active",
  },
  {
    id: 6,
    name: "Old User",
    email: "old@v2i.city",
    role: "citizen",
    lastLogin: "30 days ago",
    status: "offline",
  },
];

const API_ENDPOINTS = [
  { name: "GET /vehicles", calls: 48230, limit: 100000, status: "normal" },
  { name: "GET /signals", calls: 32100, limit: 100000, status: "normal" },
  {
    name: "POST /priority-requests",
    calls: 8940,
    limit: 20000,
    status: "normal",
  },
  { name: "GET /incidents", calls: 15600, limit: 50000, status: "normal" },
  {
    name: "PUT /signal-override",
    calls: 420,
    limit: 1000,
    status: "maintenance",
  },
];

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("Users");
  const [logs] = useState(generateAuditLogs());

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
            className="px-3 py-2 text-sm font-medium"
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
        {tab === "Users" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg"
                style={{ background: "var(--accent-blue)", color: "#fff" }}
              >
                <Plus size={14} /> Add User
              </button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {[
                      "Name",
                      "Email",
                      "Role",
                      "Last Login",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-white/5"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <td
                        className="py-3 px-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {u.name}
                      </td>
                      <td
                        className="py-3 px-4 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {u.email}
                      </td>
                      <td
                        className="py-3 px-4 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {u.role}
                      </td>
                      <td
                        className="py-3 px-4 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {u.lastLogin}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button
                            className="px-2 py-1 text-xs rounded"
                            style={{
                              background: "var(--bg-primary)",
                              border: "1px solid var(--border-color)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 text-xs rounded"
                            style={{
                              background: "rgba(255,59,59,0.1)",
                              border: "1px solid rgba(255,59,59,0.3)",
                              color: "#ff3b3b",
                            }}
                          >
                            Disable
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {[
              ["Alert Threshold (ms)", 200, 50, 500],
              ["Signal Override Timeout (s)", 60, 10, 300],
              ["Max Priority Requests", 10, 1, 50],
              ["Session Timeout (min)", 30, 5, 120],
            ].map(([label, val, min, max]) => (
              <div key={label as string} className="card p-4">
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {label}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={min}
                    max={max}
                    defaultValue={val}
                    className="flex-1"
                  />
                  <span
                    className="text-sm font-bold w-12 text-right"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    {val}
                  </span>
                </div>
              </div>
            ))}
            {[
              "Google Maps Integration",
              "Waze Integration",
              "SMS Notifications",
              "Email Reports",
            ].map((item) => (
              <div
                key={item}
                className="card p-4 flex items-center justify-between"
              >
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item}
                </span>
                <button className="relative w-12 h-6 rounded-full bg-blue-500">
                  <div className="absolute top-0.5 left-6 w-5 h-5 bg-white rounded-full shadow" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "Audit Log" && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                System Audit Log
              </h3>
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <Download size={12} /> Export
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
                  {["Timestamp", "User", "Role", "Action", "IP", "Result"].map(
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
                      {log.timestamp.toLocaleString()}
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
                      style={{ color: "var(--text-muted)" }}
                    >
                      {log.ip}
                    </td>
                    <td className="py-2 px-3">
                      <StatusBadge status={log.result} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Compliance" && (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} style={{ color: "var(--accent-blue)" }} />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  GDPR / Privacy Compliance
                </h3>
              </div>
              {[
                ["Data Retention", "180 days", "normal"],
                ["Consent Records", "Up to date", "normal"],
                ["Right to Erasure", "3 pending", "maintenance"],
                ["Privacy Impact Assessment", "Due in 14 days", "maintenance"],
              ].map(([label, val, status]) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-2 rounded mb-2"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {val}
                    </span>
                    <StatusBadge status={status} />
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-4">
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Certifications
              </h3>
              {[
                ["System Security Cert", "Valid until Dec 2026"],
                ["WCAG 2.1 AA Audit", "Last audit: Jan 2026"],
                ["ISO 27001", "Valid until Sep 2026"],
              ].map(([cert, info]) => (
                <div
                  key={cert}
                  className="flex items-center justify-between p-2 rounded mb-2"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cert}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--accent-green)" }}
                  >
                    {info}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "API Management" && (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} style={{ color: "var(--accent-blue)" }} />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  API Endpoints
                </h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {[
                      "Endpoint",
                      "Calls (30d)",
                      "Limit",
                      "Usage",
                      "Status",
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
                  {API_ENDPOINTS.map((ep) => {
                    const pct = (ep.calls / ep.limit) * 100;
                    return (
                      <tr
                        key={ep.name}
                        className="hover:bg-white/5"
                        style={{
                          borderBottom: "1px solid var(--border-color)",
                        }}
                      >
                        <td
                          className="py-2 px-3 font-mono text-xs"
                          style={{ color: "var(--accent-blue)" }}
                        >
                          {ep.name}
                        </td>
                        <td
                          className="py-2 px-3 text-xs"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {ep.calls.toLocaleString()}
                        </td>
                        <td
                          className="py-2 px-3 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {ep.limit.toLocaleString()}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-16 h-1.5 rounded-full"
                              style={{ background: "var(--border-color)" }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  background: pct > 80 ? "#ff3b3b" : "#00a8ff",
                                }}
                              />
                            </div>
                            <span
                              className="text-xs"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {pct.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <StatusBadge status={ep.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
