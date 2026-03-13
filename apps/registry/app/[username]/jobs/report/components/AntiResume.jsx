'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

function AvoidBar({ label, score }) {
  const pct = Math.min(score * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-300 w-28 truncate">{label}</span>
      <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
        <div
          className="h-full rounded-full bg-red-500/50 transition-all duration-500"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
      <span className="text-[10px] text-red-400/80 w-10 text-right tabular-nums font-mono">
        {Math.round(score * 100)}%
      </span>
    </div>
  );
}

export default function AntiResume({ antiResume }) {
  const skills = antiResume?.skills || [];
  const attributes = antiResume?.attributes || [];
  const hasData = skills.length > 0 || attributes.length > 0;

  if (!hasData) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Your Anti-Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm py-6 text-center">
            Review more jobs to reveal your avoidance patterns
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
            Your Anti-Resume
          </CardTitle>
          <span className="text-[10px] text-slate-500">
            What you consistently avoid
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-3">
                Avoided Skills
              </h4>
              <div className="space-y-1.5">
                {skills.map((s) => (
                  <AvoidBar
                    key={s.skill}
                    label={s.skill}
                    score={s.avoidScore}
                  />
                ))}
              </div>
            </div>
          )}
          {attributes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-3">
                Avoided Attributes
              </h4>
              <div className="space-y-1.5">
                {attributes.map((a) => (
                  <AvoidBar
                    key={`${a.attribute}-${a.value}`}
                    label={`${a.attribute}: ${a.value}`}
                    score={a.avoidScore}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-600 mt-4">
          Scores show how much more often these appear in rejected vs interested
          jobs
        </p>
      </CardContent>
    </Card>
  );
}
