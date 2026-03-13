'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { COLORS, TOOLTIP_STYLE } from './chartColors';

function MomentumGauge({ momentum }) {
  const score = momentum?.score ?? 0;
  const clamped = Math.max(-100, Math.min(100, score));
  const rotation = (clamped / 100) * 90;
  const color =
    score > 20
      ? 'text-emerald-400'
      : score < -20
      ? 'text-red-400'
      : 'text-amber-400';

  return (
    <div className="flex flex-col items-center py-3">
      <div className="relative w-32 h-16 overflow-hidden">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke={
              score > 20 ? '#34d399' : score < -20 ? '#f87171' : '#fbbf24'
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${Math.abs(clamped) * 1.57} 157`}
          />
          <line
            x1="60"
            y1="55"
            x2="60"
            y2="15"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${rotation}, 60, 55)`}
          />
        </svg>
      </div>
      <span className={`text-xl font-bold tabular-nums ${color}`}>{score}</span>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
        {momentum?.label || 'no data'}
      </span>
      <div className="flex gap-4 mt-2 text-[10px] text-slate-500">
        <span>This week: {momentum?.reviewsThisWeek ?? 0}</span>
        <span>Last week: {momentum?.reviewsLastWeek ?? 0}</span>
      </div>
    </div>
  );
}

function RemoteChart({ remoteIndex }) {
  const interested = remoteIndex?.interested || {};
  const data = [
    { name: 'Remote', value: interested.full || 0, fill: COLORS.interested },
    { name: 'Hybrid', value: interested.hybrid || 0, fill: COLORS.maybe },
    {
      name: 'On-site',
      value: interested.none || 0,
      fill: COLORS.notInterested,
    },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return (
      <p className="text-slate-500 text-xs text-center py-4">No remote data</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={55}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend
          wrapperStyle={{ fontSize: 10, color: '#94a3b8' }}
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function InsightsPanel({ momentum, remoteIndex, secondLook }) {
  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Momentum
            </h4>
            <MomentumGauge momentum={momentum} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Remote Preference
            </h4>
            <RemoteChart remoteIndex={remoteIndex} />
          </div>
        </div>
        {secondLook?.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-700/50">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Worth a Second Look
            </h4>
            <div className="space-y-1.5">
              {secondLook.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-2 text-xs px-2 py-1.5 rounded bg-slate-800/50"
                >
                  <span className="text-amber-400 shrink-0">{'\u{1F50D}'}</span>
                  <span className="text-slate-200 truncate">{job.title}</span>
                  <span className="text-slate-500 truncate">{job.company}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
