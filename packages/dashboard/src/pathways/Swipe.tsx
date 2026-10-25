import { useAtomSet, useAtomValue } from '@effect/atom-react';
import { Button, EmptyState, Skeleton, Text } from '@jsonresume/ui';
import type { JobMark } from '@repo/api';
import { jobMatchesAtom, markJobAtom } from '@repo/api-client';
import { JobCard } from '@repo/job-board';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { AsyncResult } from 'effect/reactivity';
import { useRef, useState, type PointerEvent } from 'react';
import * as s from './swipe.css';

/** Past this far, a drag decides: right is interested, left is a pass. */
const DECIDE = 110;

/** Unmarked matches one at a time: swipe or tap to say what you think. */
export function Swipe() {
  const result = useAtomValue(jobMatchesAtom);
  const mark = useAtomSet(markJobAtom, { mode: 'promiseExit' });
  const [done, setDone] = useState(new Set<number>());
  const [dx, setDx] = useState(0);
  const start = useRef<number | undefined>(undefined);

  if (!AsyncResult.isSuccess(result)) return <Skeleton height="20rem" />;
  const queue = result.value.filter((j) => j.mark === null && !done.has(j.id));
  const job = queue[0];
  if (!job) {
    return (
      <EmptyState title="You’ve been through them all">
        New jobs arrive with each “Who is hiring?” thread. Your marks are on the
        Jobs page.
      </EmptyState>
    );
  }

  const decide = (value: JobMark) => {
    setDone((prev) => new Set(prev).add(job.id));
    setDx(0);
    void mark({ params: { id: job.id }, payload: { mark: value } });
  };
  const onDown = (e: PointerEvent) => {
    start.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (start.current !== undefined) setDx(e.clientX - start.current);
  };
  const onUp = () => {
    start.current = undefined;
    if (dx > DECIDE) decide('interested');
    else if (dx < -DECIDE) decide('not_interested');
    else setDx(0);
  };

  return (
    <div className={s.deck}>
      <Text size="sm" tone="muted" className={s.hint}>
        {queue.length} to go · {job.score}% fit · swipe right if you’re
        interested, left to pass
      </Text>
      <div
        className={`${s.card} ${start.current !== undefined ? s.dragging : ''}`}
        style={assignInlineVars({ [s.dragX]: `${dx}px` })}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <JobCard job={job} href={`/jobs/${job.id}`} />
      </div>
      <div className={s.buttons}>
        <Button variant="secondary" onClick={() => decide('not_interested')}>
          Pass
        </Button>
        <Button variant="secondary" onClick={() => decide('maybe')}>
          Maybe
        </Button>
        <Button variant="primary" onClick={() => decide('interested')}>
          Interested
        </Button>
      </div>
    </div>
  );
}
