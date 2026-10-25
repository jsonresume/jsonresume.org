import { useAtomValue } from '@effect/atom-react';
import {
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
  Stack,
  Text,
} from '@jsonresume/ui';
import type { Direction } from '@repo/api';
import { directionsAtom, errorTag } from '@repo/api-client';
import { companyText, salaryText } from '@repo/job-board';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import * as s from './pathways.css';

const pay = (usd: number | null) =>
  usd ? salaryText({ salary: null, salaryMin: usd, salaryMax: usd }) : null;

function DirectionCard({
  d,
  onAsk,
}: {
  d: Direction;
  onAsk: (q: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>{d.name}</CardTitle>
        <div className={s.facts}>
          <Badge tone={d.bestFit >= 70 ? 'success' : 'info'}>
            Best fit {d.bestFit}%
          </Badge>
          <Text as="span" size="sm" tone="muted">
            {d.jobs} open {d.jobs === 1 ? 'role' : 'roles'} · typical fit{' '}
            {d.typicalFit}%
            {pay(d.medianPay) ? ` · about ${pay(d.medianPay)}` : ''} ·{' '}
            {d.remoteShare}% remote
          </Text>
        </div>
      </CardHeader>
      <CardContent>
        <Stack gap={3}>
          {d.skillsToAdd.length > 0 ? (
            <div>
              <span className={s.label}>Skills to add</span>
              <ul className={s.chips}>
                {d.skillsToAdd.map((skill) => (
                  <li key={skill}>
                    <Badge tone="warning">{skill}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div>
            <span className={s.label}>Asked for most</span>
            <ul className={s.chips}>
              {d.skillsAsked.map((skill) => (
                <li key={skill}>
                  <Badge tone="outline">{skill}</Badge>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className={s.label}>Best fits</span>
            <ul className={s.examples}>
              {d.examples.map((job) => (
                <li key={job.id}>
                  <a href={`/jobs/${job.id}`}>{job.title}</a>,{' '}
                  {companyText(job.company)} ({job.score}%)
                </li>
              ))}
            </ul>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              onAsk(
                `Tell me about the “${d.name}” direction for me: how close am I, what should I learn or show first, and which of its open roles should I go for?`
              )
            }
          >
            Ask Pathways about this
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

/** The directions open to the user now, best first. */
export function Directions({ onAsk }: { onAsk: (q: string) => void }) {
  const result = useAtomValue(directionsAtom);
  if (AsyncResult.isFailure(result)) {
    return errorTag(Exit.failCause(result.cause)) === 'NoResume' ? (
      <EmptyState
        title="Add your resume first"
        action={
          <Button asChild variant="primary">
            <a href="/dashboard/editor">Open the editor</a>
          </Button>
        }
      >
        Directions come from the open jobs that fit your resume.
      </EmptyState>
    ) : (
      <Callout tone="danger" title="Directions didn’t load">
        Reload the page to try again.
      </Callout>
    );
  }
  if (!AsyncResult.isSuccess(result)) {
    return (
      <div className={s.directions} aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} height="16rem" />
        ))}
      </div>
    );
  }
  return result.value.length === 0 ? (
    <EmptyState title="No directions yet">
      Not enough open jobs fit your resume to group yet.
    </EmptyState>
  ) : (
    <div className={s.directions}>
      {result.value.map((d) => (
        <DirectionCard key={d.name} d={d} onAsk={onAsk} />
      ))}
    </div>
  );
}
