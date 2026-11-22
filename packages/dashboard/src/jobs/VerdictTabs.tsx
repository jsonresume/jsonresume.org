import { ChipGroup } from '@jsonresume/ui';
import type { DecidedJob, JobMark, Verdict } from '@repo/api';
import * as s from './decide.css';
import { markViews, verdicts, VERDICTS } from './labels';

/** What the list shows: a verdict's unmarked jobs, or one mark's jobs. */
export type View = Verdict | JobMark;

export const isVerdict = (v: View): v is Verdict =>
  (VERDICTS as ReadonlyArray<string>).includes(v);

/** The jobs a view shows. */
export const inView = (jobs: ReadonlyArray<DecidedJob>, view: View) =>
  jobs.filter((j) =>
    isVerdict(view)
      ? j.mark === null && j.decision.verdict === view
      : j.mark === view
  );

/**
 * The four verdicts as big tabs with their counts, and the marked jobs as
 * chips under them.
 */
export function VerdictTabs({
  jobs,
  sent,
  counts,
  view,
  onView,
}: {
  jobs: ReadonlyArray<DecidedJob>;
  /** The jobs as the server sent them, before marks made here. */
  sent: ReadonlyArray<DecidedJob>;
  /** Every unmarked job of each verdict, sent or not. */
  counts: Record<Verdict, number>;
  view: View;
  onView: (view: View) => void;
}) {
  // Jobs the server didn't send still count; marks made here move the rest.
  const count = (v: Verdict) =>
    counts[v] - inView(sent, v).length + inView(jobs, v).length;
  return (
    <>
      <div className={s.tabs} role="group" aria-label="Decisions">
        {VERDICTS.map((v) => (
          <button
            key={v}
            type="button"
            className={s.tab}
            aria-pressed={view === v}
            onClick={() => onView(v)}
          >
            <span className={s.tabName}>
              <span className={`${s.dot} ${s.tone[v]}`} aria-hidden="true" />
              {verdicts[v].label}
            </span>
            <span className={s.tabCount}>{count(v)}</span>
            <span className={s.tabHint}>{verdicts[v].hint}</span>
          </button>
        ))}
      </div>
      <ChipGroup
        label="Marked"
        options={markViews.map((m) => ({
          ...m,
          count: inView(jobs, m.value).length,
        }))}
        value={isVerdict(view) ? null : view}
        onValueChange={(v) =>
          onView(markViews.find((m) => m.value === v)?.value ?? 'apply')
        }
      />
    </>
  );
}
