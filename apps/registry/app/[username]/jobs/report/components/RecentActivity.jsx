'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@repo/ui';

const SENTIMENT_CONFIG = {
  interested: {
    label: 'Interested',
    cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  applied: {
    label: 'Applied',
    cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  maybe: {
    label: 'Maybe',
    cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  not_interested: {
    label: 'Rejected',
    cls: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  dismissed: {
    label: 'Dismissed',
    cls: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

function formatDate(iso) {
  const d = new Date(iso);
  const month = d.toLocaleString('en', { month: 'short' });
  return `${month} ${d.getDate()}`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

export default function RecentActivity({ recentActivity }) {
  if (!recentActivity?.length) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm py-6 text-center">
            No activity recorded yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
          <div className="space-y-1">
            {recentActivity.map((item, i) => {
              const cfg =
                SENTIMENT_CONFIG[item.sentiment] ||
                SENTIMENT_CONFIG.not_interested;
              return (
                <div
                  key={`${item.date}-${i}`}
                  className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="text-[10px] text-slate-500 w-16 shrink-0 tabular-nums">
                    <div>{formatDate(item.date)}</div>
                    <div className="text-slate-600">
                      {formatTime(item.date)}
                    </div>
                  </div>
                  <Badge className={`text-[10px] shrink-0 ${cfg.cls}`}>
                    {cfg.label}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-slate-200 truncate block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {item.company}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
