'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

export default function BestMatchSimilar({ jobs }) {
  if (!jobs?.length) return null;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Jobs Like Your Best Matches
          </CardTitle>
          <span className="text-[10px] text-slate-500">
            Unreviewed jobs similar to ones you liked
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3 border border-slate-700/30"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-200 truncate">{job.title}</p>
                <p className="text-[10px] text-slate-500 truncate">
                  {job.company}
                </p>
                {job.similarTo && (
                  <p className="text-[10px] text-blue-400 mt-0.5">
                    Similar to: {job.similarTo.title} @ {job.similarTo.company}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-xs font-mono text-emerald-400">
                  {job.overlap}/{job.totalSkills}
                </span>
                <p className="text-[10px] text-slate-500">skills match</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
