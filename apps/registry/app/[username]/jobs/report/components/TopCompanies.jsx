'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@repo/ui';

const SENTIMENT_COLORS = {
  interested: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  maybe: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  not_interested: 'bg-red-500/20 text-red-400 border-red-500/30',
  dismissed: 'bg-red-500/20 text-red-400 border-red-500/30',
  dossier: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

export default function TopCompanies({ topCompanies }) {
  if (!topCompanies?.length) return null;

  const maxCount = topCompanies[0]?.count || 1;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          Top Companies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topCompanies.map(({ company, count, sentiment }) => {
            const pct = (count / maxCount) * 100;
            const cls =
              SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.not_interested;

            return (
              <div key={company} className="flex items-center gap-3">
                <span className="text-xs text-slate-300 w-32 truncate">
                  {company}
                </span>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-500/50 rounded-full transition-all"
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 w-6 text-right tabular-nums">
                  {count}
                </span>
                <Badge className={`text-[9px] ${cls}`}>
                  {sentiment?.replace('_', ' ') || 'n/a'}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
