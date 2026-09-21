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

const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 11 };
const GRID = "hsl(var(--border))";

export const SERIES_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
  },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
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
              <stop offset="0%" stopColor={SERIES_COLORS[i % SERIES_COLORS.length]} stopOpacity={0.35} />
              <stop offset="100%" stopColor={SERIES_COLORS[i % SERIES_COLORS.length]} stopOpacity={0.02} />
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
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
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
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
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
          width={150}
        />
        <Tooltip {...tooltipStyle} />
        <Bar
          dataKey={dataKey}
          fill={SERIES_COLORS[colorIndex % SERIES_COLORS.length]}
          radius={[0, 4, 4, 0]}
          barSize={14}
        />
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
  const mirrored = data.map((d) => ({ ...d, FemaleNeg: -d.Female });
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={mirrored} layout="vertical" stackOffset="sign" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis
          type="number"
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => String(Math.abs(v))}
        />
        <YAxis type="category" dataKey="group" tick={AXIS} tickLine={false} axisLine={false} width={52} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value: number, name: string) => [Math.abs(value), name === "FemaleNeg" ? "Female" : name]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === "FemaleNeg" ? "Female" : v)} />
        <Bar dataKey="FemaleNeg" stackId="a" fill={SERIES_COLORS[0]} radius={[4, 0, 0, 4]} />
        <Bar dataKey="Male" stackId="a" fill={SERIES_COLORS[1]} radius={[0, 4, 4, 0]} />
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
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={2}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
