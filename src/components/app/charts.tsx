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

const AXIS = { fill: "var(--muted-foreground)", fontSize: 11 };
const GRID = "var(--border)";

export const SERIES_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const color = (i: number) => SERIES_COLORS[i % SERIES_COLORS.length];

const tooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.5rem",
    fontSize: "12px",
    color: "var(--foreground)",
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 600 },
};

export function TrendChart({
  data,
  keys,
  height = 260,
}: {
  data: Record<string, string | number>[];
  keys: string[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
        <defs>
          {keys.map((k, i) => (
            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color(i)} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color(i)} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Area
            key={k}
            type="monotone"
            dataKey={k}
            stroke={color(i)}
            strokeWidth={2}
            fill={`url(#grad-${k})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LineTrend({
  data,
  keys,
  xKey = "month",
  height = 240,
}: {
  data: Record<string, string | number>[];
  keys: string[];
  xKey?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Line key={k} type="monotone" dataKey={k} stroke={color(i)} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HBarChart({
  data,
  dataKey = "value",
  categoryKey = "name",
  height = 280,
  colorIndex = 0,
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  categoryKey?: string;
  height?: number;
  colorIndex?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey={categoryKey}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={148}
        />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey={dataKey} fill={color(colorIndex)} radius={[0, 4, 4, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GroupedBars({
  data,
  keys,
  categoryKey = "name",
  height = 280,
}: {
  data: Record<string, string | number>[];
  keys: string[];
  categoryKey?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey={categoryKey} tick={AXIS} tickLine={false} axisLine={false} interval={0} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Bar key={k} dataKey={k} fill={color(i)} radius={[4, 4, 0, 0]} barSize={16} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PyramidChart({
  data,
  height = 300,
}: {
  data: { group: string; Female: number; Male: number }[];
  height?: number;
}) {
  const mirrored = data.map((d) => ({ group: d.group, Female: -d.Female, Male: d.Male }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={mirrored}
        layout="vertical"
        stackOffset="sign"
        margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis
          type="number"
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => String(Math.abs(v))}
        />
        <YAxis
          type="category"
          dataKey="group"
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip {...tooltipStyle} formatter={(value: number) => Math.abs(value)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Female" stackId="a" fill={color(0)} radius={[4, 0, 0, 4]} />
        <Bar dataKey="Male" stackId="a" fill={color(1)} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  height = 260,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="52%"
          outerRadius="80%"
          paddingAngle={2}
        >
          {data.map((d, i) => (
            <Cell key={d.name} fill={color(i)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
