'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

function formatK(val) {
  if (!val) return '$0';
  return `$${Math.round(val / 1000)}k`;
}

function PercentileBar({ label, value, market }) {
  if (!market?.max || !value) return null;
  const range = market.max - market.min || 1;
  const pos = ((value - market.min) / range) * 100;
  const p25Pos = ((market.p25 - market.min) / range) * 100;
  const p75Pos = ((market.p75 - market.min) / range) * 100;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
        <span>{formatK(market.min)}</span>
        <span className="text-slate-400">
          {label}: {formatK(value)}
        </span>
        <span>{formatK(market.max)}</span>
      </div>
      <div className="relative h-5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
        <div
          className="absolute h-full bg-slate-700/40"
          style={{ left: `${p25Pos}%`, width: `${p75Pos - p25Pos}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-500"
          style={{ left: `${((market.p50 - market.min) / range) * 100}%` }}
        />
        <div
          className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-lg"
          style={{ left: `calc(${Math.max(0, Math.min(pos, 100))}% - 7px)` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
        <span>P25: {formatK(market.p25)}</span>
        <span>Median: {formatK(market.p50)}</span>
        <span>P75: {formatK(market.p75)}</span>
      </div>
    </div>
  );
}

export default function SalaryIntelligence({ salary }) {
  const market = salary?.market;
  const interested = salary?.interested;
  const hasMarket = market?.p50 > 0;
  const hasInterested = interested?.p50 > 0;

  if (!hasMarket && !hasInterested) return null;

  const diff =
    hasMarket && hasInterested
      ? Math.round(((interested.p50 - market.p50) / market.p50) * 100)
      : null;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Salary Intelligence
          </CardTitle>
          {diff !== null && (
            <span
              className={`text-xs font-mono ${
                diff >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {diff >= 0 ? '+' : ''}
              {diff}% vs market
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasInterested && (
          <PercentileBar
            label="Your target"
            value={interested.p50}
            market={market}
          />
        )}
        {hasMarket && !hasInterested && (
          <PercentileBar
            label="Market median"
            value={market.p50}
            market={market}
          />
        )}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {hasMarket && (
            <div className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Market Range
              </p>
              <p className="text-sm text-slate-200 font-semibold mt-0.5">
                {formatK(market.p25)} &mdash; {formatK(market.p75)}
              </p>
            </div>
          )}
          {hasInterested && (
            <div className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Your Range
              </p>
              <p className="text-sm text-emerald-300 font-semibold mt-0.5">
                {formatK(interested.p25)} &mdash; {formatK(interested.p75)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
