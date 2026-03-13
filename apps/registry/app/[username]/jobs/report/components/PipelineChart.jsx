'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { COLORS, TOOLTIP_STYLE } from './chartColors';

function conversionLabel(from, to) {
  if (!from) return '';
  return `${Math.round((to / from) * 100)}%`;
}

export default function PipelineChart({ pipeline }) {
  const stages = [
    pipeline.totalJobsInDb > 0
      ? { name: 'Available', value: pipeline.totalJobsInDb, fill: '#475569' }
      : null,
    { name: 'Reviewed', value: pipeline.reviewed, fill: '#94a3b8' },
    { name: 'Interested', value: pipeline.interested, fill: COLORS.interested },
    { name: 'Maybe', value: pipeline.maybe, fill: COLORS.maybe },
    { name: 'Applied', value: pipeline.applied, fill: COLORS.applied },
  ].filter(Boolean);

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          Pipeline Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          {stages.map((s, i) => (
            <span key={s.name} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-slate-600 mx-1">
                  {conversionLabel(stages[i - 1].value, s.value)}
                  {' \u2192'}
                </span>
              )}
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: s.fill }}
              />
              {s.name}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={stages}
            layout="vertical"
            margin={{ left: 10, right: 40 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={80}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
              {stages.map((s) => (
                <Cell key={s.name} fill={s.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                style={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
