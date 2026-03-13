'use client';

import { Card, CardContent } from '@repo/ui';

export default function ApplicationNudge({ pipeline }) {
  const interested = pipeline?.interested || 0;
  const applied = pipeline?.applied || 0;
  const gap = interested - applied;

  if (gap <= 0 || interested < 3) return null;

  const ratio = applied / interested;
  const urgency = ratio < 0.1 ? 'high' : ratio < 0.3 ? 'medium' : 'low';

  const messages = {
    high: "You've found jobs you like — time to start applying!",
    medium: 'Good progress, but there are more opportunities waiting.',
    low: "You're almost there — just a few more applications to send.",
  };

  const colors = {
    high: 'border-amber-500/40 bg-amber-500/5',
    medium: 'border-blue-500/30 bg-blue-500/5',
    low: 'border-emerald-500/30 bg-emerald-500/5',
  };

  const iconColors = {
    high: 'text-amber-400',
    medium: 'text-blue-400',
    low: 'text-emerald-400',
  };

  return (
    <Card className={`${colors[urgency]} border`}>
      <CardContent className="p-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col items-center">
              <span
                className={`text-2xl font-bold tabular-nums ${iconColors[urgency]}`}
              >
                {gap}
              </span>
              <span className="text-[10px] text-slate-500">unapplied</span>
            </div>
            <div className="h-8 w-px bg-slate-700/50" />
            <div>
              <p className="text-sm text-slate-200">{messages[urgency]}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {interested} interested &middot; {applied} applied &middot;{' '}
                {Math.round(ratio * 100)}% conversion
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full border-2 border-slate-700/50 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={
                    urgency === 'high'
                      ? '#f59e0b'
                      : urgency === 'medium'
                      ? '#3b82f6'
                      : '#10b981'
                  }
                  strokeWidth="3"
                  strokeDasharray={`${ratio * 88} 88`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
