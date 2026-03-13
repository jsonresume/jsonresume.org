'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { COLORS, TOOLTIP_STYLE, GRID_PROPS } from './chartColors';

function formatK(val) {
  if (!val) return '$0';
  return `$${Math.round(val / 1000)}k`;
}

export default function SalaryChart({ salary }) {
  const distribution = salary?.distribution || [];
  const hasData = distribution.some((d) => d.market > 0 || d.interested > 0);

  if (!hasData) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Salary Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm py-8 text-center">
            No salary data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const medianMarket = salary?.market?.p50;
  const medianInterested = salary?.interested?.p50;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Salary Distribution
          </CardTitle>
          <div className="flex gap-4 text-xs text-slate-400">
            {medianMarket > 0 && (
              <span>
                Market median:{' '}
                <span className="text-slate-200 font-semibold">
                  {formatK(medianMarket)}
                </span>
              </span>
            )}
            {medianInterested > 0 && (
              <span>
                Your median:{' '}
                <span className="text-emerald-400 font-semibold">
                  {formatK(medianInterested)}
                </span>
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={distribution}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid {...GRID_PROPS} />
            <XAxis
              dataKey="range"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            <Bar
              dataKey="market"
              name="Market"
              fill={COLORS.market}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="interested"
              name="Interested"
              fill={COLORS.interested}
              radius={[4, 4, 0, 0]}
            />
            {medianMarket > 0 && (
              <ReferenceLine x={null} stroke="#94a3b8" strokeDasharray="4 4" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
