import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Table, Td, Th } from '../display/display';
import * as s from './viz.css';

export interface CalendarHeatmapProps {
  /** Counts per day, keyed YYYY-MM-DD. */
  data: Record<string, number>;
  /** Last day shown (defaults to today); the map covers `weeks` weeks ending here. */
  end?: Date;
  weeks?: number;
  label: string;
  /** e.g. (n) => `${n} applications` */
  formatCount?: (n: number) => string;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Activity per day over recent weeks, in the brand yellow scale. */
export function CalendarHeatmap({
  data,
  end = new Date(),
  weeks = 26,
  label,
  formatCount = (n) => `${n}`,
}: CalendarHeatmapProps) {
  const last = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
  );
  const start = new Date(last);
  start.setUTCDate(start.getUTCDate() - (weeks * 7 - 1) - last.getUTCDay());
  const days: Array<{ date: string; count: number; col: number; row: number }> =
    [];
  for (
    let d = new Date(start), i = 0;
    d <= last;
    d.setUTCDate(d.getUTCDate() + 1), i++
  ) {
    const key = iso(d);
    days.push({
      date: key,
      count: data[key] ?? 0,
      col: Math.floor(i / 7),
      row: d.getUTCDay(),
    });
  }
  const max = Math.max(1, ...days.map((d) => d.count));
  const level = (n: number) =>
    (n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4))) as 0 | 1 | 2 | 3 | 4;
  const cell = 12;
  const gap = 3;
  const total = days.reduce((n, d) => n + d.count, 0);
  const active = days.filter((d) => d.count > 0);
  return (
    <figure className={s.heatmap}>
      <svg
        role="img"
        aria-label={`${label}: ${formatCount(total)} over ${weeks} weeks, on ${
          active.length
        } days`}
        viewBox={`0 0 ${(cell + gap) * (days.at(-1)?.col ?? 0) + cell} ${
          (cell + gap) * 7
        }`}
        className={s.heatmapSvg}
        style={assignInlineVars({
          [s.heatmapWidth]: `${(cell + gap) * weeks + 40}px`,
        })}
      >
        {days.map((d) => (
          <rect
            key={d.date}
            className={s.heatCell({ level: level(d.count) })}
            x={d.col * (cell + gap)}
            y={d.row * (cell + gap)}
            width={cell}
            height={cell}
          >
            <title>{`${d.date}: ${formatCount(d.count)}`}</title>
          </rect>
        ))}
      </svg>
      <details className={s.dataToggle}>
        <summary>Show data</summary>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Count</Th>
            </tr>
          </thead>
          <tbody>
            {active.map((d) => (
              <tr key={d.date}>
                <Td>{d.date}</Td>
                <Td>{formatCount(d.count)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </details>
    </figure>
  );
}
