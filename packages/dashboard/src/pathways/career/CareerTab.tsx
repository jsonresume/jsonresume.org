import { useAtomRefresh, useAtomValue } from '@effect/atom-react';
import { Callout, EmptyState, Skeleton } from '@jsonresume/ui';
import type { CareerGraph } from '@repo/api';
import {
  careerGraphAtom,
  careerSnapshotAtom,
  errorTag,
} from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useEffect, useState } from 'react';
import { CareerArea } from './CareerMap';

type Loaded = AsyncResult.AsyncResult<CareerGraph, { readonly _tag: string }>;

function Loaded({
  result,
  month,
  onMonth,
  onAsk,
}: {
  result: Loaded;
  month: string | null;
  onMonth: (m: string | null) => void;
  onAsk: (q: string) => void;
}) {
  if (AsyncResult.isFailure(result)) {
    return errorTag(Exit.failCause(result.cause)) === 'NoResume' ? (
      <EmptyState title="Add your resume first">
        The tree grows from your resume.
      </EmptyState>
    ) : (
      <Callout tone="danger" title="The tree didn’t load">
        Reload the page to try again.
      </Callout>
    );
  }
  if (!AsyncResult.isSuccess(result))
    return <Skeleton height="60vh" aria-label="Growing your tree" />;
  return (
    <CareerArea
      graph={result.value}
      month={month}
      onMonth={onMonth}
      onAsk={onAsk}
    />
  );
}

function Live({
  onMonth,
  onAsk,
}: {
  onMonth: (m: string | null) => void;
  onAsk: (q: string) => void;
}) {
  const result = useAtomValue(careerGraphAtom);
  const refresh = useAtomRefresh(careerGraphAtom);
  const pending = AsyncResult.isSuccess(result) && result.value.pending;
  // While the resume is being read, look again every 20 seconds.
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(refresh, 20_000);
    return () => clearTimeout(t);
  }, [pending, result, refresh]);
  return (
    <Loaded result={result} month={null} onMonth={onMonth} onAsk={onAsk} />
  );
}

function Then({
  month,
  onMonth,
  onAsk,
}: {
  month: string;
  onMonth: (m: string | null) => void;
  onAsk: (q: string) => void;
}) {
  return (
    <Loaded
      result={useAtomValue(careerSnapshotAtom(month))}
      month={month}
      onMonth={onMonth}
      onAsk={onAsk}
    />
  );
}

/** Pathways → Tree: the career graph, now or as it was in a month. */
export function CareerMap({ onAsk }: { onAsk: (q: string) => void }) {
  const [month, setMonth] = useState<string | null>(null);
  return month ? (
    <Then month={month} onMonth={setMonth} onAsk={onAsk} />
  ) : (
    <Live onMonth={setMonth} onAsk={onAsk} />
  );
}
