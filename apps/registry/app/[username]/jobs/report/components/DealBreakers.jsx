'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@repo/ui';

function BarSegment({ value, maxAbs, isPositive }) {
  const width = (Math.abs(value) / maxAbs) * 100;
  const bg = isPositive ? 'bg-emerald-500/70' : 'bg-red-500/70';

  return (
    <div className="relative h-5 flex items-center">
      {!isPositive && (
        <div className="flex justify-end w-1/2 pr-1">
          <div
            className={`h-4 rounded-l ${bg}`}
            style={{ width: `${width}%` }}
          />
        </div>
      )}
      {!isPositive && <div className="w-px h-5 bg-slate-600 shrink-0" />}
      {isPositive && <div className="w-1/2" />}
      {isPositive && <div className="w-px h-5 bg-slate-600 shrink-0" />}
      {isPositive && (
        <div className="flex justify-start w-1/2 pl-1">
          <div
            className={`h-4 rounded-r ${bg}`}
            style={{ width: `${width}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function DealBreakers({ dealBreakers }) {
  if (!dealBreakers?.length) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Deal Breakers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm py-6 text-center">
            Not enough data to determine patterns
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxAbs = Math.max(
    ...dealBreakers.map((d) => Math.abs(d.divergence)),
    0.01
  );

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Deal Breakers &amp; Preferences
          </CardTitle>
          <div className="flex gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500/70" /> Reject
              signal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500/70" /> Accept
              signal
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {dealBreakers.map((item) => (
            <div
              key={`${item.feature}-${item.value}`}
              className="flex items-center gap-3"
            >
              <Badge className="bg-slate-800 border-slate-600 text-slate-300 text-[10px] min-w-[90px] justify-center">
                {item.feature}: {item.value}
              </Badge>
              <div className="flex-1">
                <BarSegment
                  value={item.divergence}
                  maxAbs={maxAbs}
                  isPositive={item.divergence < 0}
                />
              </div>
              <span
                className={`text-xs font-mono w-12 text-right ${
                  item.divergence > 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {item.divergence > 0 ? '+' : ''}
                {item.divergence}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
