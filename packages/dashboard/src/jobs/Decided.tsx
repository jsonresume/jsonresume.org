import { useAtomSet } from '@effect/atom-react';
import { Callout, Stack } from '@jsonresume/ui';
import type { DecidedJob, JobDecisions, JobMark } from '@repo/api';
import { markJobAtom } from '@repo/api-client';
import { JobFilterBar, JobList, useFilteredJobs } from '@repo/job-board';
import { useMemo, useState } from 'react';
import { DecisionCard } from './DecisionCard';
import { jobsEvent, verdicts } from './labels';
import type { MarkChange } from './MarkActions';
import { Suggestions } from './Suggestions';
import { inView, isVerdict, VerdictTabs, type View } from './VerdictTabs';
import { Wants } from './Wants';

/** The first verdict with jobs in it, else apply. */
const firstView = (jobs: ReadonlyArray<DecidedJob>): View =>
  (['apply', 'stretch', 'skip'] as const).find(
    (v) => inView(jobs, v).length > 0
  ) ?? 'apply';

const waitingText = {
  jobs: 'the AI is still reading the newest posts against your resume',
  resume: 'your resume is still being read for its skills',
};

/** "The AI is still reading …, and your resume …." */
const waitingLine = (waiting: JobDecisions['waitingFor']) => {
  const line = waiting.map((w) => waitingText[w]).join(', and ');
  return `${line.charAt(0).toUpperCase()}${line.slice(
    1
  )}. Decisions sharpen in a moment.`;
};

/**
 * The decisions: what they want, suggestions from their marks, the verdict
 * tabs and the jobs in the one chosen. Marks show at once; the decisions
 * catch up on the next load.
 */
export function Decided({ result }: { result: JobDecisions }) {
  const mark = useAtomSet(markJobAtom, { mode: 'promiseExit' });
  const [overrides, setOverrides] = useState(new Map<number, JobMark | null>());
  const jobs = useMemo(
    () =>
      result.jobs.map((job) =>
        overrides.has(job.id)
          ? { ...job, mark: overrides.get(job.id) ?? null }
          : job
      ),
    [result.jobs, overrides]
  );
  const [view, setView] = useState<View>(() => firstView(result.jobs));
  const listed = useMemo(() => inView(jobs, view), [jobs, view]);
  const shown = useFilteredJobs(listed);

  const onView = (next: View) => {
    setView(next);
    jobsEvent('jobs_view_changed', {
      view: next,
      count: inView(jobs, next).length,
    });
  };
  const onMark = (job: DecidedJob) => (change: MarkChange) => {
    setOverrides((prev) => new Map(prev).set(job.id, change.mark));
    void mark({
      params: { id: job.id },
      payload: {
        mark: change.mark,
        ...(change.reason && { reason: change.reason }),
        source: 'jobs',
        position: shown.indexOf(job),
      },
    });
  };

  return (
    <Stack gap={4}>
      <Wants preferences={result.preferences} stated={result.stated} />
      <Suggestions
        suggestions={result.suggestions}
        preferences={result.preferences}
      />
      <VerdictTabs
        jobs={jobs}
        sent={result.jobs}
        counts={result.counts}
        view={view}
        onView={onView}
      />
      {result.waitingFor.length > 0 ? (
        <Callout tone="note" title="Still deciding">
          {waitingLine(result.waitingFor)}
        </Callout>
      ) : null}
      <JobFilterBar resultCount={shown.length} />
      <JobList
        jobs={shown}
        label={isVerdict(view) ? `${verdicts[view].label} jobs` : 'Marked jobs'}
        empty={
          isVerdict(view)
            ? view === 'apply'
              ? 'Nothing to apply for yet. Look at your stretches, or loosen what you want.'
              : 'Nothing here.'
            : 'Nothing marked like this yet.'
        }
        renderJob={(job) => (
          <DecisionCard
            job={job}
            position={shown.indexOf(job)}
            view={view}
            onMark={onMark(job)}
          />
        )}
      />
    </Stack>
  );
}
