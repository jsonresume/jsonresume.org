'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

function TrendBar({ skill, change, isGrowing }) {
  const absPct = Math.min(Math.abs(change) * 500, 100);
  const bg = isGrowing ? 'bg-emerald-500/60' : 'bg-red-500/50';
  const text = isGrowing ? 'text-emerald-400' : 'text-red-400';
  const arrow = isGrowing ? '\u2191' : '\u2193';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-300 w-24 truncate">{skill}</span>
      <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
        <div
          className={`h-full rounded-full ${bg} transition-all duration-500`}
          style={{ width: `${Math.max(absPct, 4)}%` }}
        />
      </div>
      <span
        className={`text-[10px] w-12 text-right tabular-nums font-mono ${text}`}
      >
        {arrow} {Math.abs(Math.round(change * 100))}%
      </span>
    </div>
  );
}

export default function MarketDrift({ marketDrift }) {
  const growing = marketDrift?.growing || [];
  const declining = marketDrift?.declining || [];
  const trends = marketDrift?.trends || [];

  if (!growing.length && !declining.length) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Market Drift
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm py-6 text-center">
            Not enough data to detect skill trends
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Market Drift
          </CardTitle>
          <span className="text-[10px] text-slate-500">
            Skill demand trends over {trends.length} weeks
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {growing.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-emerald-400/70 uppercase tracking-wider mb-3">
                Growing Demand
              </h4>
              <div className="space-y-1.5">
                {growing.map((s) => (
                  <TrendBar
                    key={s.skill}
                    skill={s.skill}
                    change={s.change}
                    isGrowing
                  />
                ))}
              </div>
            </div>
          )}
          {declining.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-3">
                Declining Demand
              </h4>
              <div className="space-y-1.5">
                {declining.map((s) => (
                  <TrendBar
                    key={s.skill}
                    skill={s.skill}
                    change={s.change}
                    isGrowing={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
