'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = {
  orange: '#f97316',
  cyan: '#06b6d4',
  purple: '#a855f7',
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'bar' | 'line' | 'area' | 'pie';
  data: Record<string, unknown>[];
  dataKey: string;
  xAxisKey?: string;
  color?: keyof typeof COLORS;
  height?: number;
}

export default function ChartCard({
  title,
  subtitle,
  type,
  data,
  dataKey,
  xAxisKey = 'name',
  color = 'orange',
  height = 300,
}: ChartCardProps) {
  const chartColor = COLORS[color];

  return (
    <div className="bg-bg-card border border-border-default rounded-xl p-6 shadow-card">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-text-muted mt-1">{subtitle}</p>
        )}
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
              <XAxis dataKey={xAxisKey} stroke="#606078" fontSize={12} />
              <YAxis stroke="#606078" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16161f',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  color: '#f0f0f5',
                }}
              />
              <Bar dataKey={dataKey} fill={chartColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
              <XAxis dataKey={xAxisKey} stroke="#606078" fontSize={12} />
              <YAxis stroke="#606078" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16161f',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  color: '#f0f0f5',
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                strokeWidth={2}
                dot={{ fill: chartColor, r: 4 }}
              />
            </LineChart>
          ) : type === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
              <XAxis dataKey={xAxisKey} stroke="#606078" fontSize={12} />
              <YAxis stroke="#606078" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16161f',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  color: '#f0f0f5',
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                fill={chartColor}
                fillOpacity={0.1}
              />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey={dataKey}
                nameKey={xAxisKey}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16161f',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  color: '#f0f0f5',
                }}
              />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
