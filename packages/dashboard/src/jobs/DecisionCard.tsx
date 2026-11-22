import { Badge, Stack } from '@jsonresume/ui';
import type { DecidedJob } from '@repo/api';
import { JobCard } from '@repo/job-board';
import { Meters, Reasons } from './DecisionDetails';
import * as s from './decide.css';
import { jobsEvent, verdicts } from './labels';
import { MarkActions, type MarkChange } from './MarkActions';

const badgeTone = {
  apply: 'success',
  stretch: 'info',
  skip: 'neutral',
  ruled_out: 'danger',
} as const;

/**
 * A job with its decision: the verdict, how likely and how wanted, why, and
 * the marks. Opening it is tracked with where it sat in the list.
 */
export function DecisionCard({
  job,
  position,
  view,
  onMark,
}: {
  job: DecidedJob;
  position: number;
  view: string;
  onMark: (change: MarkChange) => void;
}) {
  const { verdict } = job.decision;
  return (
    <div
      className={s.card}
      onClickCapture={(e) => {
        if (
          e.target instanceof HTMLAnchorElement &&
          e.target.href.includes(`/jobs/${job.id}`)
        ) {
          jobsEvent('job_opened', {
            job_id: job.id,
            verdict,
            position,
            view,
            chance: job.decision.chance,
            appeal: job.decision.appeal,
          });
        }
      }}
    >
      <JobCard
        job={job}
        href={`/jobs/${job.id}`}
        note={<Reasons job={job} />}
        aside={
          <Stack gap={3}>
            <Badge tone={badgeTone[verdict]} className={s.verdictBadge}>
              {verdicts[verdict].label}
            </Badge>
            <Meters job={job} />
            <MarkActions mark={job.mark} title={job.title} onMark={onMark} />
          </Stack>
        }
      />
    </div>
  );
}
