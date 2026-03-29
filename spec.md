# V2I Smart Traffic Signal Priority System

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Full-stack V2I Smart Traffic Signal Priority System web application
- Role-based authentication with 8 user roles
- 14 core modules as interactive dashboards
- Responsive design: desktop, tablet, mobile
- Dark/light mode with system preference detection
- Interactive map simulation (using Leaflet with React-Leaflet)
- Real-time simulation using interval-based data updates (mock WebSocket)
- Recharts for all data visualization
- All role-specific dashboards with full feature sets

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- User session management with role storage
- Priority request log storage (CRUD)
- Incident records storage
- Vehicle status records
- Signal status records
- Analytics data storage
- Mission log storage
- Maintenance work orders storage
- Hospital bed status storage
- Network status records

### Frontend

#### Auth & Layout
- Login page with role selector (demo mode)
- App shell with sidebar navigation (role-filtered)
- Dark/light mode toggle with CSS variables
- Responsive layout with mobile bottom nav

#### Dashboard Views (per role)
1. **TMC Operator** — live map, vehicle tracking, dispatch center, resource allocation, incident management, weather overlay, predictive charts
2. **Traffic Police** — signal control panel, priority queue, manual override, emergency corridor tool, conflict alerts
3. **Emergency Vehicle Driver** — mission status, GPS map, route display, ETA, convoy mode, vehicle health, voice controls
4. **Hospital Staff** — bed availability, patient pre-transmission, arrival countdown, specialist schedule, helipad coordination
5. **Field Technician** — work orders, diagnostics, maintenance alerts, inventory, field tracking
6. **Citizen/Driver** — lane clearance alerts, approach warnings, rewards leaderboard, public map
7. **System Administrator** — user management, audit logs, system settings, compliance, API management
8. **Agency Administrator** — multi-agency map, resource tracking, secure messaging, CAD integration

#### Shared Components
- Interactive Leaflet map with custom markers, clustering, heatmap, layers
- Recharts line/bar/area/pie/radar charts
- KPI stat cards
- Status badge components
- Priority request table with filters
- Notification panel
- Signal status grid
- Timeline/audit log viewer
