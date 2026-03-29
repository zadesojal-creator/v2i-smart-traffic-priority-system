import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DARK_STYLE = {
  backgroundColor: "transparent",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  color: "var(--text-primary)",
};

export function ReLineChart({
  data,
  lines,
  height = 220,
}: {
  data: object[];
  lines: { key: string; color: string; name?: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis
          dataKey="time"
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={DARK_STYLE}
          labelStyle={{ color: "var(--text-secondary)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }}
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            name={l.name ?? l.key}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ReBarChart({
  data,
  bars,
  height = 220,
}: {
  data: object[];
  bars: { key: string; color: string; name?: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis
          dataKey="day"
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip contentStyle={DARK_STYLE} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }}
        />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            fill={b.color}
            radius={[3, 3, 0, 0]}
            name={b.name ?? b.key}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ReAreaChart({
  data,
  areas,
  height = 220,
}: {
  data: object[];
  areas: { key: string; color: string; name?: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          {areas.map((a) => (
            <linearGradient
              key={a.key}
              id={`g-${a.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={a.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={a.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis
          dataKey="time"
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip contentStyle={DARK_STYLE} />
        {areas.map((a) => (
          <Area
            key={a.key}
            type="monotone"
            dataKey={a.key}
            stroke={a.color}
            strokeWidth={2}
            fill={`url(#g-${a.key})`}
            name={a.name ?? a.key}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

const COLORS = [
  "#00a8ff",
  "#00c853",
  "#ff3b3b",
  "#ff9800",
  "#9c27b0",
  "#00bcd4",
];

export function ReDonutChart({
  data,
  height = 200,
}: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={DARK_STYLE} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
