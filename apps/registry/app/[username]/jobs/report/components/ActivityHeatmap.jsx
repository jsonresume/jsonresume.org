'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

function getIntensity(count) {
  if (count === 0) return 'bg-slate-800/60';
  if (count <= 2) return 'bg-emerald-900/60';
  if (count <= 5) return 'bg-emerald-700/60';
  if (count <= 10) return 'bg-emerald-500/60';
  return 'bg-emerald-400/70';
}

function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en', { weekday: 'narrow' });
}

export default function ActivityHeatmap({ timeline }) {
  if (!timeline?.length) return null;

  // Group by week
  const weeks = [];
  let currentWeek = [];
  for (const day of timeline) {
    const total =
      (day.interested || 0) +
      (day.maybe || 0) +
      (day.notInterested || 0) +
      (day.applied || 0);
    const d = new Date(day.date);
    if (currentWeek.length > 0 && d.getDay() === 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push({ ...day, total });
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const totalReviews = timeline.reduce(
    (sum, d) =>
      sum +
      (d.interested || 0) +
      (d.maybe || 0) +
      (d.notInterested || 0) +
      (d.applied || 0),
    0
  );
  const activeDays = timeline.filter(
    (d) =>
      (d.interested || 0) +
        (d.maybe || 0) +
        (d.notInterested || 0) +
        (d.applied || 0) >
      0
  ).length;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">
            Review Activity
          </CardTitle>
          <div className="flex gap-4 text-[10px] text-slate-500">
            <span>
              {totalReviews} reviews across {activeDays} active days
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-[3px] overflow-x-auto pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-3.5 h-3.5 rounded-sm ${getIntensity(
                    day.total
                  )} border border-slate-700/20 transition-colors`}
                  title={`${day.date}: ${day.total} reviews`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500">
          <span>Less</span>
          {[0, 2, 5, 10, 15].map((n) => (
            <div
              key={n}
              className={`w-3 h-3 rounded-sm ${getIntensity(
                n
              )} border border-slate-700/20`}
            />
          ))}
          <span>More</span>
          <span className="ml-auto">
            {dayLabel(timeline[0]?.date)} &mdash;{' '}
            {dayLabel(timeline[timeline.length - 1]?.date)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
