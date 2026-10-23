import { StatTile } from '@jsonresume/ui';
import type { Overview } from '@repo/api';
import { change, count, duration, rangeDays } from '../format';
import * as s from '../dashboard.css';

/** The headline numbers for the range, each against the range before. */
export function Kpis({ overview }: { overview: Overview }) {
  const { totals, previous, daily, range } = overview;
  const vs = `vs previous ${rangeDays[range]} days`;
  const delta = (current: number, before: number) => {
    const value = change(current, before);
    return value === undefined ? {} : { delta: { value, label: vs } };
  };
  return (
    <div className={s.kpis}>
      <StatTile
        label="Views"
        value={count(totals.views)}
        trend={daily.map((d) => d.views)}
        {...delta(totals.views, previous.views)}
        {...(totals.dataReads > 0
          ? {
              note: `Plus ${count(
                totals.dataReads
              )} reads as JSON, YAML or text`,
            }
          : {})}
      />
      <StatTile
        label="Visitors"
        value={count(totals.visitors)}
        trend={daily.map((d) => d.visitors)}
        {...delta(totals.visitors, previous.visitors)}
      />
      <StatTile
        label="Median time on page"
        value={totals.medianSeconds > 0 ? duration(totals.medianSeconds) : '—'}
        {...delta(totals.medianSeconds, previous.medianSeconds)}
      />
      <StatTile
        label="Read depth"
        value={totals.readDepth > 0 ? `${totals.readDepth}%` : '—'}
        note="How far down readers scroll, on average"
        {...delta(totals.readDepth, previous.readDepth)}
      />
    </div>
  );
}
