import {
  AlertTriangle,
  Bell,
  Flag,
  QrCode,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TrafficMap } from "../../components/map/TrafficMap";
import { generateVehicles } from "../../data/mockData";
import type { Vehicle } from "../../types";

const TABS = ["Alerts", "Map", "Leaderboard", "Report"] as const;
type Tab = (typeof TABS)[number];

const LEADERBOARD = [
  { rank: 1, name: "Sarah M.", points: 1240, clears: 87 },
  { rank: 2, name: "James K.", points: 1085, clears: 72 },
  { rank: 3, name: "Emily R.", points: 980, clears: 65 },
  { rank: 4, name: "You", points: 420, clears: 28, isMe: true },
  { rank: 5, name: "Michael T.", points: 380, clears: 25 },
];

export function CitizenDashboard() {
  const [tab, setTab] = useState<Tab>("Alerts");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [ambulanceApproaching, _setAmbulanceApproaching] = useState(true);
  const [laneCleared, setLaneCleared] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    setVehicles(generateVehicles());
    const t = setInterval(() => setVehicles(generateVehicles()), 8000);
    const c = setInterval(
      () => setCountdown((p) => (p > 0 ? p - 1 : 15)),
      1000,
    );
    return () => {
      clearInterval(t);
      clearInterval(c);
    };
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
        {tab === "Alerts" && (
          <div className="space-y-4">
            {/* Main Alert */}
            {ambulanceApproaching && (
              <div
                className="card p-5 pulse-ring"
                style={{
                  border: "2px solid var(--accent-red)",
                  borderRadius: 16,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center pulse-ring"
                    style={{ background: "var(--accent-red)" }}
                  >
                    <Bell size={22} color="white" />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-bold"
                      style={{ color: "#ff3b3b" }}
                    >
                      ⚠️ AMBULANCE APPROACHING
                    </h2>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      AMB-103 is 0.4 miles away • ETA: 2 min
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Please pull over to the right and clear the lane immediately.
                </p>
                {!laneCleared ? (
                  <button
                    onClick={() => setLaneCleared(true)}
                    className="w-full py-3 rounded-xl text-base font-bold"
                    style={{ background: "var(--accent-green)", color: "#fff" }}
                  >
                    ✓ Lane Cleared
                  </button>
                ) : (
                  <div
                    className="text-center py-2 rounded-xl"
                    style={{
                      background: "rgba(0,200,83,0.15)",
                      border: "1px solid rgba(0,200,83,0.3)",
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--accent-green)" }}
                    >
                      ✓ Lane cleared at {new Date().toLocaleTimeString()} —
                      Thank you!
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      +50 points earned
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pedestrian Countdown */}
            <div className="card p-4">
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Pedestrian Crossing Countdown
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
                  style={{ borderColor: countdown > 8 ? "#00c853" : "#ff3b3b" }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: countdown > 8 ? "#00c853" : "#ff3b3b" }}
                  >
                    {countdown}
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {countdown > 8 ? "Safe to cross" : "Do not cross"}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Main St & 5th Ave
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {audioEnabled ? (
                    <Volume2
                      size={16}
                      style={{ color: "var(--accent-blue)" }}
                    />
                  ) : (
                    <VolumeX size={16} style={{ color: "var(--text-muted)" }} />
                  )}
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Audible Alerts
                  </span>
                </div>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${audioEnabled ? "bg-blue-500" : "bg-gray-600"}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${audioEnabled ? "left-6" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>

            {/* Points */}
            <div
              className="card p-4"
              style={{ borderTop: "3px solid #ff9800" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={18} style={{ color: "#ff9800" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Your Points
                  </span>
                </div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#ff9800" }}
                >
                  420
                </span>
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Rank #4 this month • 28 lanes cleared
              </p>
            </div>
          </div>
        )}

        {tab === "Map" && (
          <div className="card overflow-hidden" style={{ height: "65vh" }}>
            <TrafficMap
              vehicles={vehicles.filter((v) => v.status === "on_mission")}
              height="100%"
            />
          </div>
        )}

        {tab === "Leaderboard" && (
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={18} style={{ color: "#ff9800" }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Monthly Leaderboard
              </h3>
            </div>
            <div className="space-y-2">
              {LEADERBOARD.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    background: entry.isMe
                      ? "rgba(0,168,255,0.1)"
                      : "var(--bg-primary)",
                    border: `1px solid ${entry.isMe ? "var(--accent-blue)" : "var(--border-color)"}`,
                  }}
                >
                  <span
                    className="text-lg font-bold w-6 text-center"
                    style={{
                      color:
                        entry.rank === 1
                          ? "#ffd700"
                          : entry.rank === 2
                            ? "#c0c0c0"
                            : entry.rank === 3
                              ? "#cd7f32"
                              : "var(--text-muted)",
                    }}
                  >
                    {entry.rank}
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: entry.isMe
                          ? "var(--accent-blue)"
                          : "var(--text-primary)",
                      }}
                    >
                      {entry.name}
                      {entry.isMe ? " (You)" : ""}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {entry.clears} lanes cleared
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--accent-amber)" }}
                  >
                    {entry.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Report" && (
          <div className="card p-6 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Flag size={18} style={{ color: "var(--accent-red)" }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Report Failure to Yield
              </h3>
            </div>
            <div className="space-y-3">
              {[
                ["Vehicle Description", "text", "e.g. Blue sedan, ABC-123"],
                ["Location", "text", "Street intersection"],
                ["Time", "datetime-local", ""],
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
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the incident..."
                  className="w-full p-2 rounded-lg text-sm resize-none"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <button
                className="w-full py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--accent-red)", color: "#fff" }}
              >
                <AlertTriangle size={14} className="inline mr-2" />
                Submit Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
