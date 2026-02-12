'use client';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface MoodChartProps {
  data: { date: string; score: number; label: string }[];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

interface TooltipPayloadEntry {
  value: number;
  payload: { date: string; label: string };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const d = payload[0];
  return (
    <div className="glass-strong rounded-xl px-4 py-3 shadow-lg text-xs border-0">
      <p className="font-semibold text-stone-700">{formatDate(d.payload.date)}</p>
      <p className="gradient-text font-bold mt-0.5">
        Mood: {d.value}/10 ({d.payload.label})
      </p>
    </div>
  );
}

export default function MoodChart({ data }: MoodChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-6 h-48 flex items-center justify-center shadow-sm">
        <p className="text-stone-400 text-sm">No mood data yet</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }));

  return (
    <section
      className="relative overflow-hidden glass-strong rounded-2xl p-5 md:p-6 shadow-md"
      aria-label="Mood trend chart"
    >
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100/40 to-transparent rounded-bl-full" aria-hidden="true" />

      <h3 className="relative text-sm md:text-base font-semibold text-stone-700 mb-4">
        Mood over time
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity={0.25} />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 11, fill: '#78716c' }}
            axisLine={{ stroke: '#e7e5e4' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 11, fill: '#78716c' }}
            axisLine={{ stroke: '#e7e5e4' }}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#0d9488"
            strokeWidth={3}
            fill="url(#moodGradient)"
            dot={{ fill: '#0d9488', strokeWidth: 2, stroke: '#fff', r: 4 }}
            activeDot={{ r: 7, fill: '#0d9488', stroke: '#fff', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
