interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  normal: { label: "Normal", cls: "status-normal" },
  priority_mode: { label: "Priority", cls: "status-priority" },
  fault: { label: "Fault", cls: "status-fault" },
  maintenance: { label: "Maintenance", cls: "status-maintenance" },
  active: { label: "Active", cls: "status-active" },
  available: { label: "Available", cls: "status-active" },
  on_mission: { label: "On Mission", cls: "status-mission" },
  idle: { label: "Idle", cls: "status-idle" },
  offline: { label: "Offline", cls: "status-maintenance" },
  open: { label: "Open", cls: "status-fault" },
  responding: { label: "Responding", cls: "status-priority" },
  resolved: { label: "Resolved", cls: "status-active" },
  pending: { label: "Pending", cls: "status-maintenance" },
  completed: { label: "Completed", cls: "status-active" },
  denied: { label: "Denied", cls: "status-fault" },
  online: { label: "Online", cls: "status-active" },
  degraded: { label: "Degraded", cls: "status-maintenance" },
  in_progress: { label: "In Progress", cls: "status-priority" },
  low: { label: "Low", cls: "status-active" },
  medium: { label: "Medium", cls: "status-maintenance" },
  high: { label: "High", cls: "status-fault" },
  critical: { label: "Critical", cls: "status-fault" },
  success: { label: "Success", cls: "status-active" },
  failure: { label: "Failure", cls: "status-fault" },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, cls: "status-idle" };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${config.cls} ${className}`}
    >
      {config.label}
    </span>
  );
}
