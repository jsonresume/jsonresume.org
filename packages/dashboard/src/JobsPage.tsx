import { useAtomRefresh, useAtomValue } from '@effect/atom-react';
import {
  AppPage,
  Button,
  Callout,
  EmptyState,
  Skeleton,
  Stack,
} from '@jsonresume/ui';
import {
  errorTag,
  jobDecisionsAtom,
  jobDecisionsNowAtom,
} from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useEffect, type ReactNode } from 'react';
import { Decided } from './jobs/Decided';

/** /dashboard/jobs: every open job decided for the user: apply, stretch, skip or ruled out. */
export function JobsPage() {
  const full = useAtomValue(jobDecisionsAtom);
  // Asked for at once alongside: a first visit sees jobs decided so far
  // (from embeddings) instead of waiting up to 4 seconds for the models.
  const now = useAtomValue(jobDecisionsNowAtom);
  const result =
    AsyncResult.isSuccess(full) || !AsyncResult.isSuccess(now) ? full : now;
  const refresh = useAtomRefresh(jobDecisionsAtom);
  const waiting =
    AsyncResult.isSuccess(full) && full.value.waitingFor.length > 0;
  // While the models work, ask again: each request waits up to 4 seconds
  // for them, so decisions sharpen soon after each finishes.
  useEffect(() => {
    if (!waiting) return;
    const t = setTimeout(refresh, 1_500);
    return () => clearTimeout(t);
  }, [waiting, full, refresh]);

  const page = (children: ReactNode) => (
    <AppPage
      title="Jobs for you"
      description="Every open role from Hacker News “Who is hiring?”, decided for you: how likely you’d get it, and how much you’d want it."
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
    return page(<Decided result={result.value} />);
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
          Jobs are decided against your resume, so there needs to be one.
        </EmptyState>
      ) : (
        <Callout tone="danger" title="Jobs didn’t load">
          Something went wrong deciding jobs. Reload the page to try again.
        </Callout>
      )
    );
  }
  return page(
    <Stack gap={3} aria-busy="true" aria-label="Deciding jobs">
      <Skeleton height="4.5rem" />
      <Skeleton height="6rem" />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} height="9rem" />
      ))}
    </Stack>
  );
}
