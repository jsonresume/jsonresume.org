'use client';

import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { cx } from '../../utils/cx';
import { ChartFrame } from './chart-frame';
import { compactNumber } from './scale';
import { geometry } from './time-series-geometry';
import { TimeSeriesPlot, type PlotSeries } from './time-series-plot';
import { TimeSeriesTooltip } from './time-series-tooltip';
import * as s from './time-series.css';
import { useWidth } from './use-width';

export interface TimeSeriesPoint {
  /** A day, YYYY-MM-DD. */
  date: string;
  values: Readonly<Record<string, number>>;
}

export interface TimeSeriesSeries {
  key: string;
  label: string;
  /** Defaults to an area for the first series and lines for the rest. */
  mark?: 'area' | 'line';
}

export interface TimeSeriesChartProps {
  title: string;
  /** One sentence on what the chart shows, for screen readers. */
  summary: string;
  data: ReadonlyArray<TimeSeriesPoint>;
  /** One or two series, coloured in order. */
  series: ReadonlyArray<TimeSeriesSeries>;
  formatValue?: (value: number) => string;
  formatDate?: (date: string) => string;
  /** Height including the date axis, px. */
  height?: number;
  /** Refetching: keep showing the previous data, quieter. */
  loading?: boolean;
  emptyLabel?: string;
  className?: string;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "2026-10-12" → "12 Oct". The same on server and client, in any locale. */
export const formatDay = (date: string) => {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
  const month = months[Number(match?.[1]) - 1];
  return match && month ? `${Number(match[2])} ${month}` : date;
};

const colors = [vars.color.chart.series1, vars.color.chart.series2];

/**
 * Change over time for one or two series: an area under the first, lines
 * for the rest, a crosshair that snaps to the nearest day with one tooltip
 * for every series, and arrow keys to step through the days.
 */
export function TimeSeriesChart({
  title,
  summary,
  data,
  series: seriesSpec,
  formatValue = compactNumber,
  formatDate = formatDay,
  height = 240,
  loading = false,
  emptyLabel = 'No data in this period',
  className,
}: TimeSeriesChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>(640);
  const [active, setActive] = useState<number | null>(null);
  const series: PlotSeries[] = seriesSpec.slice(0, 2).map((ser, i) => ({
    key: ser.key,
    label: ser.label,
    mark: ser.mark ?? (i === 0 ? 'area' : 'line'),
    values: data.map((d) => d.values[ser.key] ?? 0),
  }));
  const max = Math.max(0, ...series.flatMap((ser) => ser.values));
  const g = geometry(width, height, data.length, max, formatValue);
  const empty = data.length === 0 || max === 0;
  const dates = data.map((d) => d.date);

  const onPointer = (event: PointerEvent<SVGElement | HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setActive(g.indexAt(event.clientX - box.left));
  };
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (data.length === 0) return;
    const at = active ?? data.length - 1;
    const next =
      event.key === 'ArrowLeft'
        ? at - 1
        : event.key === 'ArrowRight'
        ? at + 1
        : event.key === 'Home'
        ? 0
        : event.key === 'End'
        ? data.length - 1
        : null;
    if (next === null) return;
    event.preventDefault();
    setActive(Math.min(data.length - 1, Math.max(0, next)));
  };

  const shown = empty ? null : active;
  const readout =
    shown === null
      ? ''
      : `${formatDate(dates[shown] ?? '')}: ${series
          .map((ser) => `${ser.label} ${formatValue(ser.values[shown] ?? 0)}`)
          .join(', ')}`;
  const tipLeft =
    shown === null
      ? 0
      : g.x(shown) > width - 170
      ? g.x(shown) - 162
      : g.x(shown) + 12;

  return (
    <ChartFrame
      title={title}
      summary={summary}
      plot="custom"
      className={cx(s.frame, loading && s.loading, className)}
      legend={
        series.length > 1
          ? series.map((ser, i) => ({
              label: ser.label,
              color: colors[i] ?? vars.color.chart.series1,
              mark: ser.mark === 'area' ? ('rect' as const) : ('line' as const),
            }))
          : undefined
      }
      table={{
        columns: ['Date', ...series.map((ser) => ser.label)],
        rows: data.map((d, i) => [
          formatDate(d.date),
          ...series.map((ser) => formatValue(ser.values[i] ?? 0)),
        ]),
      }}
    >
      <div
        ref={ref}
        className={s.plot}
        role="group"
        aria-roledescription="chart"
        aria-label={`${summary} Use the arrow keys to read each day.`}
        aria-busy={loading || undefined}
        tabIndex={0}
        onPointerMove={onPointer}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <TimeSeriesPlot
          g={g}
          dates={dates}
          series={series}
          active={shown}
          empty={empty}
          emptyLabel={emptyLabel}
          formatValue={formatValue}
          formatDate={formatDate}
        />
        {shown !== null ? (
          <TimeSeriesTooltip
            date={formatDate(dates[shown] ?? '')}
            series={series}
            index={shown}
            x={Math.max(0, tipLeft)}
            y={g.top}
            formatValue={formatValue}
          />
        ) : null}
        <span className={visuallyHidden} aria-live="polite">
          {readout}
        </span>
      </div>
    </ChartFrame>
  );
}
