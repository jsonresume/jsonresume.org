'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

const ARCHETYPE_COLORS = [
  {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-300',
    dot: 'bg-violet-400',
  },
  {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
  },
  {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
  },
  {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
];

export default function Archetypes({ archetypes }) {
  if (!archetypes?.length) return null;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Your Job Archetypes
          </CardTitle>
          <span className="text-[10px] text-slate-500">
            Clusters of roles you gravitate toward
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {archetypes.map((arch, i) => {
            const c = ARCHETYPE_COLORS[i % ARCHETYPE_COLORS.length];
            return (
              <div
                key={arch.name}
                className={`rounded-lg ${c.bg} border ${c.border} p-3`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-sm font-medium ${c.text}`}>
                    {arch.name}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-auto">
                    {arch.count} jobs
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {arch.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="space-y-0.5">
                  {arch.titles.map((t, ti) => (
                    <p key={ti} className="text-[10px] text-slate-500 truncate">
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
