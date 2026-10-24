import { Button, EmptyState } from '@jsonresume/ui';
import type { JobSummary } from '@repo/api';
import { useState, type ReactNode } from 'react';
import * as s from './board.css';

const PAGE = 40;

export interface JobListProps<J extends JobSummary> {
  jobs: ReadonlyArray<J>;
  renderJob: (job: J) => ReactNode;
  empty?: ReactNode;
  /** Accessible name of the list. */
  label?: string;
}

/** Jobs a page at a time, with "Show more". */
export function JobList<J extends JobSummary>({
  jobs,
  renderJob,
  empty,
  label = 'Jobs',
}: JobListProps<J>) {
  const [shown, setShown] = useState(PAGE);
  if (jobs.length === 0) {
    return (
      <EmptyState className={s.empty} title="No jobs match">
        {empty ?? 'Try fewer filters, or another word.'}
      </EmptyState>
    );
  }
  return (
    <>
      <ul className={s.list} role="list" aria-label={label}>
        {jobs.slice(0, shown).map((job) => (
          <li key={job.id}>{renderJob(job)}</li>
        ))}
      </ul>
      {jobs.length > shown && (
        <div className={s.more}>
          <Button variant="secondary" onClick={() => setShown(shown + PAGE)}>
            Show more ({jobs.length - shown} left)
          </Button>
        </div>
      )}
    </>
  );
}
