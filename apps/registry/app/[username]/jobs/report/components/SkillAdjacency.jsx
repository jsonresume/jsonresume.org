'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

function AdjacencyRow({ rec, maxCount }) {
  const pct = maxCount ? (rec.coCount / maxCount) * 100 : 0;

  return (
    <div className="flex items-center gap-2 group">
      <div className="w-24 shrink-0">
        <span className="text-xs text-cyan-300 truncate block">
          {rec.skill}
        </span>
        <span className="text-[10px] text-slate-500">
          pairs with <span className="text-slate-400">{rec.because}</span>
        </span>
      </div>
      <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
        <div
          className="h-full rounded-full bg-cyan-500/50 transition-all duration-500"
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <div className="text-right shrink-0 w-16">
        <span className="text-[10px] text-slate-400 tabular-nums">
          {rec.totalJobs} jobs
        </span>
      </div>
    </div>
  );
}

export default function SkillAdjacency({ skillAdjacency }) {
  const recs = skillAdjacency || [];

  if (!recs.length) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Skill Adjacency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm py-6 text-center">
            Not enough data to compute skill adjacency
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = recs[0]?.coCount || 1;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Skills to Learn Next
          </CardTitle>
          <span className="text-[10px] text-slate-500">
            Based on co-occurrence in job listings
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recs.map((rec) => (
            <AdjacencyRow key={rec.skill} rec={rec} maxCount={maxCount} />
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-4">
          Skills frequently requested alongside ones you already have
        </p>
      </CardContent>
    </Card>
  );
}
