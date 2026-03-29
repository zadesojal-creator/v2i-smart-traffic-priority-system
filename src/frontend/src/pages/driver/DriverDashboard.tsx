import {
  AlertTriangle,
  Battery,
  Gauge,
  Mic,
  Navigation,
  Users2,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { TrafficMap } from "../../components/map/TrafficMap";
import { generateVehicles } from "../../data/mockData";
import { useAppStore } from "../../store/appStore";

const ROUTE: [number, number][] = [
  [40.7128, -74.006],
  [40.718, -74.002],
  [40.722, -73.998],
  [40.727, -73.993],
  [40.731, -73.989],
];

const HOSPITALS = [
  "City General Hospital",
  "St. Mary Medical Center",
  "Memorial Hospital",
];

export function DriverDashboard() {
  const { vehicles, setVehicles } = useAppStore();
  const [onMission, setOnMission] = useState(false);
  const [eta, setEta] = useState(8);
  const [listening, setListening] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[0]);
  const myVehicle = vehicles[0];

  useEffect(() => {
    setVehicles(generateVehicles());
    const t = setInterval(() => {
      setVehicles(generateVehicles());
      if (onMission) setEta((prev) => Math.max(1, prev - 1));
    }, 5000);
    return () => clearInterval(t);
  }, [onMission]);

  const startVoice = () => {
    setListening(true);
    setTimeout(() => setListening(false), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mission Toggle */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: onMission ? "rgba(255,59,59,0.1)" : "var(--bg-secondary)",
          borderBottom: `1px solid ${onMission ? "rgba(255,59,59,0.3)" : "var(--border-color)"}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${onMission ? "bg-red-400 pulse-ring" : "bg-gray-500"}`}
          />
          <span
            className="font-semibold"
            style={{
              color: onMission ? "#ff3b3b" : "var(--text-secondary)",
              fontSize: 15,
            }}
          >
            {onMission ? "ON MISSION" : "STANDBY"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Wifi size={14} style={{ color: "var(--accent-green)" }} />
            <span className="text-xs" style={{ color: "var(--accent-green)" }}>
              V2I Connected
            </span>
          </div>
          <button
            onClick={() => setOnMission(!onMission)}
            className={`relative w-14 h-7 rounded-full transition-colors ${onMission ? "bg-red-500" : "bg-gray-600"}`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${onMission ? "left-8" : "left-1"}`}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Map */}
        <div className="relative" style={{ height: 280 }}>
          <TrafficMap
            vehicles={vehicles.slice(0, 1)}
            route={onMission ? ROUTE : undefined}
            height="100%"
          />
          {/* Turn-by-turn overlay */}
          {onMission && (
            <div
              className="absolute top-3 left-3 right-3 p-3 rounded-lg"
              style={{
                background: "rgba(0,0,0,0.85)",
                border: "1px solid var(--accent-blue)",
              }}
            >
              <div className="flex items-center gap-2">
                <Navigation size={18} style={{ color: "var(--accent-blue)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Next turn in 0.3 mi
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Turn RIGHT onto Broadway
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* ETA Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="kpi-card text-center"
              style={{ borderTop: "3px solid var(--accent-blue)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                ETA
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--accent-blue)" }}
              >
                {eta}m
              </p>
            </div>
            <div
              className="kpi-card text-center"
              style={{ borderTop: "3px solid var(--accent-green)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Distance
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--accent-green)" }}
              >
                2.4mi
              </p>
            </div>
            <div
              className="kpi-card text-center"
              style={{ borderTop: "3px solid var(--accent-amber)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Speed
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--accent-amber)" }}
              >
                {myVehicle?.speed ?? 45}km/h
              </p>
            </div>
          </div>

          {/* Hospital Selection & Route Request */}
          <div className="card p-4">
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Route to Hospital
            </h3>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full p-2 rounded-lg text-sm mb-3"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {HOSPITALS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                className="flex-1 py-3 rounded-lg text-sm font-bold pulse-blue"
                style={{ background: "var(--accent-blue)", color: "#fff" }}
              >
                <Navigation size={14} className="inline mr-2" />
                Request Optimal Route
              </button>
              <button
                className="px-3 py-3 rounded-lg text-sm font-semibold"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                Share ETA
              </button>
            </div>
          </div>

          {/* Vehicle Health */}
          {myVehicle && (
            <div className="card p-4">
              <h3
                className="text-sm font-semibold mb-3 flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <Zap size={15} style={{ color: "var(--accent-amber)" }} />{" "}
                Vehicle Health
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Battery
                      size={12}
                      style={{ color: "var(--accent-green)" }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Battery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-2 rounded-full"
                      style={{ background: "var(--border-color)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${myVehicle.battery}%`,
                          background: "var(--accent-green)",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {myVehicle.battery}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Gauge size={12} style={{ color: "var(--accent-blue)" }} />
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Systems
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {["Engine", "Brakes", "Lights", "Radio"].map((sys) => (
                      <span
                        key={sys}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(0,200,83,0.15)",
                          color: "#00c853",
                          fontSize: 9,
                        }}
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Convoy */}
          <div className="card p-4">
            <h3
              className="text-sm font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Users2 size={15} style={{ color: "var(--accent-blue)" }} />{" "}
              Convoy Mode
            </h3>
            <div className="space-y-2">
              {vehicles.slice(1, 4).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {v.callsign}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {Math.round(Math.random() * 500 + 100)}m away
                    </span>
                    <StatusBadge status={v.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternate Routes */}
          <div className="card p-4">
            <h3
              className="text-sm font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <AlertTriangle
                size={15}
                style={{ color: "var(--accent-amber)" }}
              />{" "}
              Alternate Routes
            </h3>
            {[
              { name: "Via Park Ave", time: eta + 2, status: "clear" },
              { name: "Via 5th Ave", time: eta + 4, status: "congested" },
            ].map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between p-2 rounded-lg mb-2"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.time}m
                  </span>
                  <StatusBadge
                    status={r.status === "clear" ? "available" : "maintenance"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Control FAB */}
      <div
        className="p-4 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <button
          onClick={startVoice}
          className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${listening ? "pulse-ring" : ""}`}
          style={{
            background: listening ? "var(--accent-red)" : "var(--bg-card)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <Mic
            size={18}
            style={{ color: listening ? "#fff" : "var(--accent-blue)" }}
          />
          {listening ? "Listening..." : "Voice Control"}
        </button>
      </div>
    </div>
  );
}
