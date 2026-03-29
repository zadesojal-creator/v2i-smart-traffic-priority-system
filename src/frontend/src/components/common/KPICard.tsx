import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: number;
  borderColor?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "var(--accent-blue)",
  trend,
  borderColor,
}: KPICardProps) {
  return (
    <div
      className="kpi-card flex items-start gap-3 relative overflow-hidden"
      style={{
        borderTop: borderColor ? `3px solid ${borderColor}` : undefined,
      }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${iconColor}20`, color: iconColor }}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-medium mb-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </p>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {trend !== undefined && (
        <div
          className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
