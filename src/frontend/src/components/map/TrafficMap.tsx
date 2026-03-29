import { useEffect, useRef } from "react";
import type { Incident, TrafficSignal, Vehicle } from "../../types";

interface TrafficMapProps {
  vehicles?: Vehicle[];
  signals?: TrafficSignal[];
  incidents?: Incident[];
  height?: string;
  route?: [number, number][];
  onSignalClick?: (id: string) => void;
  onVehicleClick?: (id: string) => void;
}

export function TrafficMap({
  vehicles = [],
  signals = [],
  incidents = [],
  height = "100%",
  route,
  onSignalClick,
  onVehicleClick,
}: TrafficMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const vehicleLayerRef = useRef<unknown>(null);
  const signalLayerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let leafletMap: ReturnType<typeof import("leaflet").map> | undefined;

    import("leaflet").then((mod) => {
      const L = mod.default ?? mod;

      if (!mapRef.current) return;

      leafletMap = L.map(mapRef.current, {
        center: [40.7128, -74.006],
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { attribution: "&copy; CartoDB", subdomains: "abcd", maxZoom: 19 },
      ).addTo(leafletMap);

      mapInstanceRef.current = leafletMap;

      const vLayer = L.layerGroup().addTo(leafletMap);
      vehicleLayerRef.current = vLayer;

      vehicles.forEach((v) => {
        const color =
          v.status === "on_mission"
            ? "#ff3b3b"
            : v.status === "available"
              ? "#00c853"
              : "#ff9800";
        const icon = L.divIcon({
          html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:10px;color:white;font-weight:bold;">${v.callsign.slice(-2)}</div>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const marker = L.marker([v.lat, v.lng], { icon }).addTo(vLayer);
        marker.bindPopup(
          `<b>${v.callsign}</b><br>Status: ${v.status}<br>Battery: ${v.battery}%`,
        );
        if (onVehicleClick) marker.on("click", () => onVehicleClick(v.id));
      });

      const sLayer = L.layerGroup().addTo(leafletMap);
      signalLayerRef.current = sLayer;

      signals.forEach((s) => {
        const color =
          s.status === "normal"
            ? "#00c853"
            : s.status === "priority_mode"
              ? "#00a8ff"
              : s.status === "fault"
                ? "#ff3b3b"
                : "#ff9800";
        const icon = L.divIcon({
          html: `<div style="width:16px;height:16px;border-radius:3px;background:${color};border:2px solid rgba(255,255,255,0.6);"></div>`,
          className: "",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const marker = L.marker([s.lat, s.lng], { icon }).addTo(sLayer);
        marker.bindPopup(
          `<b>${s.name}</b><br>Status: ${s.status}<br>Battery: ${s.battery}%`,
        );
        if (onSignalClick) marker.on("click", () => onSignalClick(s.id));
      });

      incidents.forEach((inc) => {
        const color =
          inc.severity >= 4
            ? "#ff3b3b"
            : inc.severity >= 3
              ? "#ff9800"
              : "#ffeb3b";
        const icon = L.divIcon({
          html: `<div style="width:22px;height:22px;border-radius:50%;background:${color};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:11px">⚠</div>`,
          className: "",
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(
          leafletMap!,
        );
        marker.bindPopup(
          `<b>${inc.type.toUpperCase()}</b><br>${inc.description}<br>Severity: ${inc.severity}/5`,
        );
      });

      if (route && route.length > 1) {
        L.polyline(route, {
          color: "#00a8ff",
          weight: 4,
          opacity: 0.8,
          dashArray: "8, 4",
        }).addTo(leafletMap);
      }
    });

    return () => {
      if (leafletMap) leafletMap.remove();
      mapInstanceRef.current = null;
      vehicleLayerRef.current = null;
      signalLayerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%", borderRadius: 8, overflow: "hidden" }}
    />
  );
}
