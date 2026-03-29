import { create } from "zustand";
import type {
  Incident,
  NetworkStatus,
  PriorityRequest,
  Role,
  TrafficSignal,
  User,
  Vehicle,
} from "../types";

interface AppState {
  user: User | null;
  theme: "dark" | "light";
  activeView: string;
  vehicles: Vehicle[];
  signals: TrafficSignal[];
  priorityRequests: PriorityRequest[];
  incidents: Incident[];
  network: NetworkStatus;
  notifications: {
    id: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    time: Date;
  }[];
  sidebarOpen: boolean;

  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  setActiveView: (view: string) => void;
  setVehicles: (v: Vehicle[]) => void;
  setSignals: (s: TrafficSignal[]) => void;
  addPriorityRequest: (r: PriorityRequest) => void;
  setIncidents: (i: Incident[]) => void;
  setNetwork: (n: NetworkStatus) => void;
  addNotification: (
    msg: string,
    type?: "info" | "warning" | "error" | "success",
  ) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  theme: "dark",
  activeView: "overview",
  vehicles: [],
  signals: [],
  priorityRequests: [],
  incidents: [],
  network: {
    dsrcLatency: 12,
    cvx2Latency: 18,
    cellularStrength: 87,
    fiberStatus: "online",
    cybersecurityAlerts: 2,
    throughput: 450,
    uptime: 99.7,
  },
  notifications: [],
  sidebarOpen: true,

  setUser: (user) => {
    set({ user });
    if (user) document.documentElement.setAttribute("data-theme", get().theme);
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    set({ theme: next });
    document.documentElement.setAttribute("data-theme", next);
  },
  setActiveView: (view) => set({ activeView: view }),
  setVehicles: (vehicles) => set({ vehicles }),
  setSignals: (signals) => set({ signals }),
  addPriorityRequest: (r) =>
    set((s) => ({ priorityRequests: [r, ...s.priorityRequests].slice(0, 50) })),
  setIncidents: (incidents) => set({ incidents }),
  setNetwork: (network) => set({ network }),
  addNotification: (msg, type = "info") => {
    const n = {
      id: Math.random().toString(36).slice(2),
      message: msg,
      type,
      time: new Date(),
    };
    set((s) => ({ notifications: [n, ...s.notifications].slice(0, 20) }));
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
