import type {
  AuditLog,
  HospitalBed,
  Incident,
  Message,
  PriorityRequest,
  TrafficSignal,
  Vehicle,
  WorkOrder,
} from "../types";

const CITY_CENTER = { lat: 40.7128, lng: -74.006 };

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max));
const pick = <T>(arr: readonly T[] | T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const HOSPITALS = [
  "City General Hospital",
  "St. Mary Medical Center",
  "Memorial Hospital",
  "University Health",
];

const CALLSIGNS = [
  "AMB-101",
  "AMB-102",
  "AMB-103",
  "AMB-104",
  "AMB-105",
  "AMB-106",
  "AMB-107",
  "AMB-108",
  "FIRE-01",
  "FIRE-02",
  "POL-201",
  "POL-202",
];
const INTERSECTIONS = [
  "Main St & 5th Ave",
  "Broadway & 42nd",
  "Park Ave & 34th",
  "Lexington & 23rd",
  "Madison & 57th",
  "Central Park W & 72nd",
  "7th Ave & 14th",
  "Canal & Varick",
  "1st Ave & Houston",
  "Atlantic & Flatbush",
  "Northern Blvd & 150th",
  "Queens Blvd & Junction",
  "Flatbush & Nostrand",
  "Church & Fulton",
  "Fordham & Grand Concourse",
  "White Plains Rd & Boston Post",
  "Hylan Blvd & Richmond",
  "Victory Blvd & Manor",
  "5th Ave & 42nd",
  "Houston & Bowery",
];

export function generateVehicles(): Vehicle[] {
  return CALLSIGNS.slice(0, 8).map((cs, i) => ({
    id: `v${i + 1}`,
    callsign: cs,
    status: pick([
      "available",
      "available",
      "on_mission",
      "on_mission",
      "available",
      "maintenance",
      "available",
      "on_mission",
    ] as const),
    lat: CITY_CENTER.lat + rand(-0.08, 0.08),
    lng: CITY_CENTER.lng + rand(-0.08, 0.08),
    battery: randInt(25, 100),
    speed: randInt(0, 80),
    heading: randInt(0, 360),
    hospital: i % 3 === 1 ? HOSPITALS[i % HOSPITALS.length] : undefined,
    driver: `Driver ${i + 1}`,
    agency: cs.startsWith("AMB")
      ? "ambulance"
      : cs.startsWith("FIRE")
        ? "fire"
        : "police",
    eta: pick([undefined, randInt(3, 15)]),
  })) as Vehicle[];
}

export function generateSignals(): TrafficSignal[] {
  return INTERSECTIONS.map((name, i) => ({
    id: `sig${i + 1}`,
    name,
    lat: CITY_CENTER.lat + rand(-0.1, 0.1),
    lng: CITY_CENTER.lng + rand(-0.1, 0.1),
    status: pick([
      "normal",
      "normal",
      "normal",
      "priority_mode",
      "normal",
      "fault",
      "normal",
      "maintenance",
      "normal",
      "normal",
    ] as const),
    battery: randInt(60, 100),
    solar: randInt(40, 100),
    lastActivation: `${randInt(1, 59)}m ago`,
    greenDuration: randInt(25, 60),
    redDuration: randInt(30, 70),
    yellowDuration: 5,
  }));
}

export function generatePriorityRequests(): PriorityRequest[] {
  const vehicles = generateVehicles();
  const signals = generateSignals();
  return Array.from({ length: 12 }, (_, i) => ({
    id: `pr${i + 1}`,
    vehicleId: vehicles[i % vehicles.length].id,
    vehicleCallsign: vehicles[i % vehicles.length].callsign,
    signalId: signals[i % signals.length].id,
    signalName: signals[i % signals.length].name,
    timestamp: new Date(Date.now() - randInt(0, 3600000)),
    status: pick([
      "pending",
      "active",
      "completed",
      "completed",
      "active",
    ] as const),
    eta: randInt(1, 8),
    priority: pick([1, 2, 3] as const),
  }));
}

export function generateIncidents(): Incident[] {
  const types = [
    "accident",
    "fire",
    "medical",
    "roadblock",
    "weather",
  ] as const;
  const addresses = [
    "125 Main St",
    "450 Broadway",
    "88 Park Ave",
    "33 5th Ave",
    "900 Lexington",
    "12 Church St",
    "77 Broad St",
    "200 Water St",
    "555 Canal St",
    "888 Houston St",
  ];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `inc${i + 1}`,
    type: pick(types),
    lat: CITY_CENTER.lat + rand(-0.07, 0.07),
    lng: CITY_CENTER.lng + rand(-0.07, 0.07),
    severity: randInt(1, 6) as 1 | 2 | 3 | 4 | 5,
    status: pick(["open", "responding", "resolved"] as const),
    description: `${pick(["Multi-vehicle", "Single unit", "Major", "Minor"])} ${pick(types)} at ${addresses[i]}`,
    assignedUnits: [CALLSIGNS[i % CALLSIGNS.length]],
    timestamp: new Date(Date.now() - randInt(0, 7200000)),
    address: addresses[i],
  }));
}

export function generateWorkOrders(): WorkOrder[] {
  const issues = [
    "LED failure",
    "Controller malfunction",
    "Battery backup failure",
    "Solar panel offline",
    "Communication error",
    "Timing drift",
    "Physical damage",
    "Sensor failure",
  ];
  return Array.from({ length: 15 }, (_, i) => ({
    id: `wo${i + 1}`,
    signalId: `sig${(i % 20) + 1}`,
    signalName: INTERSECTIONS[i % INTERSECTIONS.length],
    issueType: pick(issues),
    priority: pick(["low", "medium", "high", "critical"] as const),
    status: pick(["open", "open", "in_progress", "completed"] as const),
    technicianId: pick(["tech1", "tech2", "tech3", undefined]),
    createdAt: new Date(Date.now() - randInt(0, 604800000)),
    notes: `Reported by monitoring system. ${pick(["Requires immediate attention.", "Scheduled for inspection.", "Parts ordered.", ""])}`,
  }));
}

export function generateHospitalBeds(): HospitalBed[] {
  return [
    {
      category: "ER",
      total: 40,
      available: randInt(4, 18),
      reserved: randInt(2, 6),
    },
    {
      category: "ICU",
      total: 20,
      available: randInt(2, 8),
      reserved: randInt(1, 3),
    },
    {
      category: "OR",
      total: 12,
      available: randInt(2, 6),
      reserved: randInt(0, 2),
    },
  ];
}

export function generateAuditLogs(): AuditLog[] {
  const actions = [
    "Login",
    "Signal Override",
    "Priority Grant",
    "Route Dispatch",
    "User Created",
    "Config Changed",
    "Export Data",
    "Override Denied",
  ];
  const users = [
    "admin@v2i",
    "tmc.jones",
    "police.smith",
    "tech.wang",
    "hospital.doe",
  ];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `log${i + 1}`,
    user: pick(users),
    role: pick([
      "admin",
      "tmc_operator",
      "traffic_police",
      "field_technician",
      "hospital_staff",
    ]),
    action: pick(actions),
    details: `Action performed on signal ${randInt(1, 20)} or vehicle ${randInt(1, 8)}`,
    timestamp: new Date(Date.now() - randInt(0, 86400000)),
    ip: `192.168.${randInt(1, 10)}.${randInt(1, 254)}`,
    result: pick(["success", "success", "success", "failure"] as const),
  }));
}

export function generateMessages(): Message[] {
  const senders = [
    "Chief Rodriguez",
    "Dispatcher Kim",
    "Lt. Okafor",
    "Sgt. Martinez",
    "Dr. Chen",
  ];
  const agencies = ["Fire Dept", "Police", "EMS", "Hospital", "TMC"];
  const contents = [
    "Route 5 is clear, proceed via Main St.",
    "Additional units needed at 3rd Ave.",
    "Hospital on standby for incoming trauma.",
    "Signal corridor activated on Broadway.",
    "Weather alert: heavy fog on northern routes.",
    "All units: avoid Canal St overpass.",
  ];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `msg${i + 1}`,
    from: pick(senders),
    agency: pick(agencies),
    content: pick(contents),
    timestamp: new Date(Date.now() - randInt(0, 3600000)),
    read: Math.random() > 0.4,
  }));
}

export function generateLatencyData(points = 20) {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i}m`,
    dsrc: randInt(8, 25),
    cvx2: randInt(12, 35),
    cellular: randInt(45, 120),
  }));
}

export function generateResponseTimeData(days = 14) {
  return Array.from({ length: days }, (_, i) => ({
    day: `Day ${i + 1}`,
    actual: randInt(4, 12),
    estimated: randInt(5, 10),
    target: 8,
  }));
}

export function generateHourlyData() {
  return Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    requests: randInt(h >= 7 && h <= 20 ? 5 : 0, h >= 7 && h <= 20 ? 18 : 4),
    incidents: randInt(0, 5),
  }));
}
