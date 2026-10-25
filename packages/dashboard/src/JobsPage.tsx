import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  AppPage,
  Badge,
  Button,
  Callout,
  ChipGroup,
  EmptyState,
  Skeleton,
  Stack,
} from '@jsonresume/ui';
import type { JobMark, JobMatch } from '@repo/api';
import { errorTag, jobMatchesAtom, markJobAtom } from '@repo/api-client';
import {
  JobCard,
  JobFilterBar,
  JobList,
  useFilteredJobs,
} from '@repo/job-board';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import * as s from './jobs.css';
import { useMemo, useState, type ReactNode } from 'react';

const marks: ReadonlyArray<{ value: JobMark; label: string; short?: string }> =
  [
    { value: 'interested', label: 'Interested' },
    { value: 'maybe', label: 'Maybe' },
    { value: 'applied', label: 'Applied' },
    { value: 'not_interested', label: 'Not for me', short: 'Pass' },
  ];

/** Strong fits stand out; the rest read as plain numbers. */
const fitTone = (score: number) =>
  score >= 70 ? 'success' : score >= 45 ? 'info' : 'neutral';

function Marks({
  job,
  onMark,
}: {
  job: JobMatch;
  onMark: (mark: JobMark | null) => void;
}) {
  return (
    <>
      <Badge tone={fitTone(job.score)}>{job.score}% fit</Badge>
      <div className={s.marks} role="group" aria-label="Mark this job">
        {marks.map((m) => (
          <Button
            key={m.value}
            size="sm"
            variant={job.mark === m.value ? 'primary' : 'secondary'}
            aria-pressed={job.mark === m.value}
            aria-label={m.label}
            onClick={() => onMark(job.mark === m.value ? null : m.value)}
          >
            {m.short ?? m.label}
          </Button>
        ))}
      </div>
    </>
  );
}

export function Matches({ jobs }: { jobs: ReadonlyArray<JobMatch> }) {
  const mark = useAtomSet(markJobAtom, { mode: 'promiseExit' });
  // Marks show at once; the ranking catches up next visit.
  const [overrides, setOverrides] = useState(new Map<number, JobMark | null>());
  const [view, setView] = useState<string | null>(null);
  const marked = useMemo(
    () =>
      jobs.map((job) =>
        overrides.has(job.id)
          ? { ...job, mark: overrides.get(job.id) ?? null }
          : job
      ),
    [jobs, overrides]
  );
  const filtered = useFilteredJobs(marked);
  const shown = filtered.filter((job) =>
    view === null ? job.mark !== 'not_interested' : job.mark === view
  );
  const onMark = (id: number) => (value: JobMark | null) => {
    setOverrides((prev) => new Map(prev).set(id, value));
    void mark({ params: { id }, payload: { mark: value } });
  };
  const count = (value: JobMark) =>
    marked.filter((job) => job.mark === value).length;

  return (
    <>
      <ChipGroup
        label="Show"
        allLabel="To review"
        options={marks.map((m) => ({ ...m, count: count(m.value) }))}
        value={view}
        onValueChange={setView}
      />
      <JobFilterBar resultCount={shown.length} />
      <JobList
        jobs={shown}
        label="Jobs for you"
        empty={
          view
            ? 'Nothing marked like this yet.'
            : 'Try fewer filters, or another word.'
        }
        renderJob={(job) => (
          <JobCard
            job={job}
            href={`/jobs/${job.id}`}
            aside={<Marks job={job} onMark={onMark(job.id)} />}
          />
        )}
      />
    </>
  );
}

/** /dashboard/jobs: open jobs ranked against the user's resume. */
export function JobsPage() {
  const result = useAtomValue(jobMatchesAtom);
  const page = (children: ReactNode) => (
    <AppPage
      title="Jobs for you"
      description="Open roles from Hacker News “Who is hiring?”, ranked by how well they fit your resume. What you mark nudges the ranking."
      actions={
        <Button asChild variant="secondary">
          <a href="/jobs">Browse every job</a>
        </Button>
      }
    >
      {children}
    </AppPage>
  );

  if (AsyncResult.isSuccess(result))
    return page(<Matches jobs={result.value} />);
  if (AsyncResult.isFailure(result)) {
    return page(
      errorTag(Exit.failCause(result.cause)) === 'NoResume' ? (
        <EmptyState
          title="Add your resume first"
          action={
            <Button asChild variant="primary">
              <a href="/dashboard/editor">Open the editor</a>
            </Button>
          }
        >
          Jobs are ranked by how well they fit your resume, so there needs to be
          one.
        </EmptyState>
      ) : (
        <Callout tone="danger" title="Jobs didn’t load">
          Something went wrong ranking jobs. Reload the page to try again.
        </Callout>
      )
    );
  }
  return page(
    <Stack gap={3} aria-busy="true" aria-label="Ranking jobs">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} height="7rem" />
      ))}
    </Stack>
  );
}
