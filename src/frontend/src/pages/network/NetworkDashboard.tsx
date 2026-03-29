import { Activity, AlertTriangle, Shield, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { ReAreaChart, ReLineChart } from "../../components/charts/Charts";
import { KPICard } from "../../components/common/KPICard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { generateLatencyData } from "../../data/mockData";
import { useAppStore } from "../../store/appStore";

export function NetworkDashboard() {
  const { network, setNetwork } = useAppStore();
  const [latencyData, setLatencyData] = useState(generateLatencyData(20));

  useEffect(() => {
    const t = setInterval(() => {
      setLatencyData(generateLatencyData(20));
      setNetwork({
        dsrcLatency: Math.round(8 + Math.random() * 15),
        cvx2Latency: Math.round(12 + Math.random() * 20),
        cellularStrength: Math.round(70 + Math.random() * 25),
        fiberStatus: "online",
        cybersecurityAlerts: Math.round(Math.random() * 5),
        throughput: Math.round(350 + Math.random() * 150),
        uptime: 99.7,
      });
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin p-4 space-y-4">
      {/* Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "DSRC",
            latency: `${network.dsrcLatency}ms`,
            ok: network.dsrcLatency < 30,
          },
          {
            label: "C-V2X",
            latency: `${network.cvx2Latency}ms`,
            ok: network.cvx2Latency < 40,
          },
          {
            label: "Cellular",
            latency: `${network.cellularStrength}%`,
            ok: network.cellularStrength > 70,
          },
          {
            label: "Fiber",
            latency: network.fiberStatus,
            ok: network.fiberStatus === "online",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="kpi-card"
            style={{
              borderTop: `3px solid ${item.ok ? "#00c853" : "#ff3b3b"}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${item.ok ? "bg-green-400" : "bg-red-400"}`}
              />
            </div>
            <p
              className="text-xl font-bold mt-1"
              style={{ color: item.ok ? "#00c853" : "#ff3b3b" }}
            >
              {item.latency}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          title="Uptime"
          value={`${network.uptime}%`}
          icon={Activity}
          iconColor="#00c853"
        />
        <KPICard
          title="Throughput"
          value={`${network.throughput} Mbps`}
          icon={Zap}
          iconColor="#00a8ff"
        />
        <KPICard
          title="Security Alerts"
          value={network.cybersecurityAlerts}
          icon={Shield}
          iconColor={network.cybersecurityAlerts > 0 ? "#ff9800" : "#00c853"}
        />
        <KPICard
          title="Active Nodes"
          value="24"
          subtitle="of 24 total"
          icon={Wifi}
          iconColor="#00c853"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            End-to-End Latency (ms)
          </h3>
          <ReLineChart
            data={latencyData}
            lines={[
              { key: "dsrc", color: "#00a8ff", name: "DSRC" },
              { key: "cvx2", color: "#00c853", name: "C-V2X" },
              { key: "cellular", color: "#ff9800", name: "Cellular" },
            ]}
          />
        </div>
        <div className="card p-4">
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Network Throughput (Mbps)
          </h3>
          <ReAreaChart
            data={latencyData.map((d, _i) => ({
              ...d,
              throughput: 300 + Math.random() * 200,
            }))}
            areas={[
              { key: "throughput", color: "#00a8ff", name: "Throughput" },
            ]}
          />
        </div>
      </div>

      {/* Cybersecurity */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield
            size={16}
            style={{
              color: network.cybersecurityAlerts > 0 ? "#ff9800" : "#00c853",
            }}
          />
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Cybersecurity Status
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            ["Encryption", "AES-256", "normal"],
            ["Auth", "MFA Active", "normal"],
            ["Firewall", "Active", "normal"],
            [
              "Intrusion Detection",
              network.cybersecurityAlerts > 0
                ? `${network.cybersecurityAlerts} Alerts`
                : "Clear",
              network.cybersecurityAlerts > 0 ? "maintenance" : "normal",
            ],
          ].map(([label, val, status]) => (
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
                className="text-sm font-semibold mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {val}
              </p>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>
      </div>

      {/* Edge Nodes */}
      <div className="card p-4">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Edge Computing Nodes
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 12 }, (_, i) => {
            const lat = Math.round(5 + Math.random() * 20);
            return (
              <div
                key={i}
                className="p-2 rounded-lg text-center"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full mx-auto mb-1 ${lat < 15 ? "bg-green-400" : lat < 25 ? "bg-amber-400" : "bg-red-400"}`}
                />
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Node {i + 1}
                </p>
                <p
                  className="text-xs font-bold"
                  style={{
                    color:
                      lat < 15 ? "#00c853" : lat < 25 ? "#ff9800" : "#ff3b3b",
                  }}
                >
                  {lat}ms
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
