'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

function SkillBar({ skill, count, maxCount, isUserSkill }) {
  const pct = maxCount ? (count / maxCount) * 100 : 0;
  const bg = isUserSkill ? 'bg-emerald-500/60' : 'bg-slate-600/60';

  return (
    <div className="flex items-center gap-2 group">
      <span
        className={`text-xs w-28 truncate ${
          isUserSkill ? 'text-emerald-300' : 'text-slate-300'
        }`}
      >
        {skill}
      </span>
      <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
        <div
          className={`h-full rounded-full ${bg} transition-all duration-500`}
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <span className="text-[10px] text-slate-500 w-6 text-right tabular-nums">
        {count}
      </span>
    </div>
  );
}

export default function SkillGaps({ skills }) {
  const userSkillSet = new Set(
    (skills?.userSkills || []).map((s) => s.toLowerCase())
  );
  const topDemanded = skills?.topDemanded || [];
  const gaps = skills?.gaps || [];
  const maxDemand = topDemanded[0]?.count || 1;
  const maxGap = gaps[0]?.count || 1;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          Skills Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Top Skills in Demand
            </h4>
            {topDemanded.length === 0 && (
              <p className="text-slate-500 text-xs">No data yet</p>
            )}
            <div className="space-y-1.5">
              {topDemanded.map(({ skill, count }) => (
                <SkillBar
                  key={skill}
                  skill={skill}
                  count={count}
                  maxCount={maxDemand}
                  isUserSkill={userSkillSet.has(skill)}
                />
              ))}
            </div>
            {topDemanded.length > 0 && (
              <div className="flex gap-3 mt-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60" />{' '}
                  Your skill
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-600/60" /> Not
                  listed
                </span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Skills You May Be Missing
            </h4>
            {gaps.length === 0 && (
              <p className="text-slate-500 text-xs">No gaps detected</p>
            )}
            <div className="space-y-1.5">
              {gaps.map(({ skill, count }) => (
                <SkillBar
                  key={skill}
                  skill={skill}
                  count={count}
                  maxCount={maxGap}
                  isUserSkill={false}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
