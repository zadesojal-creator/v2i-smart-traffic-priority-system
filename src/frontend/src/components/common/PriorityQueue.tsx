import { Clock } from "lucide-react";
import type { PriorityRequest } from "../../types";
import { StatusBadge } from "./StatusBadge";

interface PriorityQueueProps {
  requests: PriorityRequest[];
  showActions?: boolean;
  maxRows?: number;
}

export function PriorityQueue({
  requests,
  showActions = false,
  maxRows = 10,
}: PriorityQueueProps) {
  const displayed = requests.slice(0, maxRows);
  return (
    <div className="overflow-auto scrollbar-thin">
      <table
        className="w-full text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <th className="text-left py-2 px-3 font-medium text-xs">Vehicle</th>
            <th className="text-left py-2 px-3 font-medium text-xs">
              Intersection
            </th>
            <th className="text-left py-2 px-3 font-medium text-xs">ETA</th>
            <th className="text-left py-2 px-3 font-medium text-xs">Status</th>
            {showActions && (
              <th className="text-left py-2 px-3 font-medium text-xs">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayed.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-white/5 transition-colors"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${r.priority === 1 ? "bg-red-400" : r.priority === 2 ? "bg-amber-400" : "bg-blue-400"}`}
                  />
                  <span className="font-medium">{r.vehicleCallsign}</span>
                </div>
              </td>
              <td
                className="py-2 px-3 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {r.signalName.split(" & ")[0]} &amp; ...
              </td>
              <td className="py-2 px-3">
                <div
                  className="flex items-center gap-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Clock size={12} />
                  <span className="text-xs">{r.eta}m</span>
                </div>
              </td>
              <td className="py-2 px-3">
                <StatusBadge status={r.status} />
              </td>
              {showActions && r.status === "pending" && (
                <td className="py-2 px-3">
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-0.5 text-xs rounded font-semibold"
                      style={{
                        background: "var(--accent-blue)",
                        color: "#fff",
                      }}
                    >
                      Grant
                    </button>
                    <button
                      className="px-2 py-0.5 text-xs rounded font-semibold"
                      style={{ background: "var(--accent-red)", color: "#fff" }}
                    >
                      Deny
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
