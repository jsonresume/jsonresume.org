import {
  Callout,
  ProgressSteps,
  Stack,
  Text,
  TreeMapSkeleton,
  type ProgressStep,
} from '@jsonresume/ui';
import type { CareerGraph, CareerWait } from '@repo/api';
import { useEffect, useState } from 'react';
import * as s from './career.css';

/** Whole seconds since the component mounted. */
function useSeconds() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(
      () => setSeconds(Math.floor((Date.now() - start) / 1000)),
      1000
    );
    return () => clearInterval(t);
  }, []);
  return seconds;
}

/* Typical times are from production logs (2026-10-30 to 11-06). */
const steps = (waiting: ReadonlyArray<CareerWait>): ProgressStep[] => [
  {
    id: 'resume',
    label: 'Reading your resume for the skills each role shows',
    state: waiting.includes('resume') ? 'active' : 'done',
    detail: waiting.includes('resume')
      ? 'A new version takes 20 to 60 seconds to read. Until then the tree uses your skills list.'
      : undefined,
  },
  {
    id: 'jobs',
    label: 'Judging today’s jobs against it',
    state: waiting.includes('jobs') ? 'active' : 'done',
    detail: waiting.includes('jobs')
      ? 'Usually under 30 seconds. Until then fits come from how alike the texts are.'
      : undefined,
  },
];

/** Before the first answer: the tree's shape, and what is happening. */
export function GraphLoading() {
  const seconds = useSeconds();
  return (
    <div className={s.map}>
      <TreeMapSkeleton label="Your career graph">
        <Stack gap={1}>
          <Text weight="semibold">Growing your tree</Text>
          <Text size="sm" tone="muted">
            {seconds < 8
              ? 'Gathering your resume and today’s jobs.'
              : `Still gathering, ${seconds} seconds in. The first look at a new resume takes longest.`}
          </Text>
        </Stack>
      </TreeMapSkeleton>
    </div>
  );
}

/** While the graph is pending: what is done, what isn't, and for how long. */
export function GraphProgress({ graph }: { graph: CareerGraph }) {
  const seconds = useSeconds();
  // Older answers say only that something is pending: the resume's reading.
  const waiting: ReadonlyArray<CareerWait> = graph.waitingFor?.length
    ? graph.waitingFor
    : ['resume'];
  return (
    <Callout tone="info" title="Your tree is still filling in">
      <div role="status">
        <ProgressSteps label="What’s left" steps={steps(waiting)} />
        <Text size="sm" tone="muted">
          {seconds > 0 ? `${seconds} seconds so far. ` : ''}The tree updates by
          itself when each finishes.
        </Text>
      </div>
    </Callout>
  );
}
