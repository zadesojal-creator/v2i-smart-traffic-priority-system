export type Role =
  | "tmc_operator"
  | "traffic_police"
  | "driver"
  | "hospital_staff"
  | "field_technician"
  | "citizen"
  | "admin"
  | "agency_admin";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  badge?: string;
}

export interface Vehicle {
  id: string;
  callsign: string;
  status: "available" | "on_mission" | "maintenance" | "offline";
  lat: number;
  lng: number;
  battery: number;
  speed: number;
  heading: number;
  missionId?: string;
  eta?: number;
  hospital?: string;
  driver?: string;
  agency?: "ambulance" | "fire" | "police";
}

export interface TrafficSignal {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "normal" | "priority_mode" | "fault" | "maintenance";
  battery: number;
  solar: number;
  lastActivation?: string;
  priorityVehicle?: string;
  greenDuration: number;
  redDuration: number;
  yellowDuration: number;
}

export interface PriorityRequest {
  id: string;
  vehicleId: string;
  vehicleCallsign: string;
  signalId: string;
  signalName: string;
  timestamp: Date;
  status: "pending" | "active" | "completed" | "denied";
  eta: number;
  priority: 1 | 2 | 3;
}

export interface Incident {
  id: string;
  type: "accident" | "fire" | "medical" | "roadblock" | "weather";
  lat: number;
  lng: number;
  severity: 1 | 2 | 3 | 4 | 5;
  status: "open" | "responding" | "resolved";
  description: string;
  assignedUnits: string[];
  timestamp: Date;
  address: string;
}

export interface WorkOrder {
  id: string;
  signalId: string;
  signalName: string;
  issueType: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "completed";
  technicianId?: string;
  createdAt: Date;
  notes: string;
}

export interface HospitalBed {
  category: "ER" | "ICU" | "OR";
  total: number;
  available: number;
  reserved: number;
}

export interface NetworkStatus {
  dsrcLatency: number;
  cvx2Latency: number;
  cellularStrength: number;
  fiberStatus: "online" | "degraded" | "offline";
  cybersecurityAlerts: number;
  throughput: number;
  uptime: number;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: Date;
  ip: string;
  result: "success" | "failure";
}

export interface Message {
  id: string;
  from: string;
  agency: string;
  content: string;
  timestamp: Date;
  read: boolean;
}
