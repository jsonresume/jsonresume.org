'use client';

import { Card, CardContent } from '@repo/ui';

const stats = [
  {
    key: 'reviewed',
    label: 'Reviewed',
    icon: '\u{1F4CB}',
    color: 'text-slate-300',
    bg: 'bg-slate-800/60',
  },
  {
    key: 'interested',
    label: 'Interested',
    icon: '\u{2705}',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'applied',
    label: 'Applied',
    icon: '\u{1F680}',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'maybe',
    label: 'Maybe',
    icon: '\u{1F914}',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    key: 'notInterested',
    label: 'Rejected',
    icon: '\u{274C}',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    key: 'dossiers',
    label: 'Dossiers',
    icon: '\u{1F4D1}',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
];

function pct(n, total) {
  if (!total) return '0%';
  return `${Math.round((n / total) * 100)}%`;
}

export default function HeroSection({ pipeline, username, days, momentum }) {
  const label = momentum?.label || 'no-data';
  const labelColor =
    label === 'accelerating'
      ? 'text-emerald-400'
      : label === 'slowing'
      ? 'text-red-400'
      : 'text-amber-400';

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {username}
            <span className="text-slate-500 font-normal"> / job report</span>
          </h1>
          <p className="text-slate-400 mt-1">
            Last {days} days &middot; Momentum:{' '}
            <span className={`font-semibold ${labelColor}`}>{label}</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(({ key, label: statLabel, icon, color, bg }) => (
          <Card key={key} className={`${bg} border-slate-700/50`}>
            <CardContent className="p-4 pt-4">
              <div className="text-lg mb-1">{icon}</div>
              <div className={`text-2xl font-bold tabular-nums ${color}`}>
                {pipeline[key] ?? 0}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{statLabel}</div>
              {key !== 'reviewed' && key !== 'dossiers' && (
                <div className="text-[10px] text-slate-500 mt-1">
                  {pct(pipeline[key], pipeline.reviewed)} of reviewed
                </div>
              )}
              {key === 'reviewed' && pipeline.totalJobsInDb > 0 && (
                <div className="text-[10px] text-slate-500 mt-1">
                  {pct(pipeline.reviewed, pipeline.totalJobsInDb)} of{' '}
                  {pipeline.totalJobsInDb} available
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
