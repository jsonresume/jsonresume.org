'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { TOOLTIP_STYLE } from './chartColors';

function RadarCard({ job }) {
  const data = [
    { axis: 'Skills', value: job.scores.skills },
    { axis: 'Experience', value: job.scores.experience },
    { axis: 'Remote', value: job.scores.remote },
    { axis: 'Salary', value: job.scores.salary },
    { axis: 'Location', value: job.scores.location ?? 50 },
    { axis: 'Visa', value: job.scores.visa ?? 70 },
  ];

  const color =
    job.overall >= 70 ? '#34d399' : job.overall >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
      <div className="flex items-center justify-between mb-1">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-200 truncate">{job.title}</p>
          <p className="text-[10px] text-slate-500 truncate">{job.company}</p>
        </div>
        <div
          className="text-sm font-bold tabular-nums shrink-0 ml-2"
          style={{ color }}
        >
          {job.overall}%
        </div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#94a3b8', fontSize: 9 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={1.5}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
        </RadarChart>
      </ResponsiveContainer>
      {(job.matchedSkills?.length > 0 || job.missingSkills?.length > 0) && (
        <div className="mt-1.5 space-y-1">
          {job.matchedSkills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.matchedSkills.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-800/30"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          {job.missingSkills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.missingSkills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800/30"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReadinessRadar({ readiness }) {
  if (!readiness?.length) return null;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Interview Readiness
          </CardTitle>
          <span className="text-[10px] text-slate-500">
            How well you match your top interested jobs
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {readiness.map((job) => (
            <RadarCard key={job.id} job={job} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
