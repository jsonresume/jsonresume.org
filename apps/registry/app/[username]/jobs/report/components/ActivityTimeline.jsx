'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { COLORS, TOOLTIP_STYLE, GRID_PROPS } from './chartColors';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function ActivityTimeline({ timeline }) {
  if (!timeline?.length) return null;

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          Daily Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={timeline}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradInterested" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.interested}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.interested}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="gradApplied" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.applied}
                  stopOpacity={0.4}
                />
                <stop offset="95%" stopColor={COLORS.applied} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMaybe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.maybe} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.maybe} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradReject" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.notInterested}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.notInterested}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelFormatter={formatDate} />
            <Area
              type="monotone"
              dataKey="applied"
              stackId="1"
              stroke={COLORS.applied}
              fill="url(#gradApplied)"
            />
            <Area
              type="monotone"
              dataKey="interested"
              stackId="1"
              stroke={COLORS.interested}
              fill="url(#gradInterested)"
            />
            <Area
              type="monotone"
              dataKey="maybe"
              stackId="1"
              stroke={COLORS.maybe}
              fill="url(#gradMaybe)"
            />
            <Area
              type="monotone"
              dataKey="notInterested"
              stackId="1"
              stroke={COLORS.notInterested}
              fill="url(#gradReject)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
