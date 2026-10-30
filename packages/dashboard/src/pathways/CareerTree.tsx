import { useAtomValue } from '@effect/atom-react';
import {
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  EmptyState,
  Skeleton,
  Stack,
  Text,
  TreeMap,
} from '@jsonresume/ui';
import type { CareerTree as Tree } from '@repo/api';
import { careerTreeAtom, errorTag } from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useMemo, useState } from 'react';
import { related, treeModel } from './treeModel';
import * as s from './tree.css';

const KIND: Record<Tree['nodes'][number]['kind'], string> = {
  skill: 'On your resume',
  gap: 'Missing from your resume',
  experience: 'Your experience',
  direction: 'A kind of role',
  job: 'A job',
};

function Legend() {
  return (
    <ul className={s.legend} aria-label="Key">
      <li>
        <span className={`${s.swatch} ${s.have}`} aria-hidden="true" /> On your
        resume
      </li>
      <li>
        <span className={`${s.swatch} ${s.gap}`} aria-hidden="true" /> Asked
        for, not shown yet
      </li>
      <li>
        <span className={`${s.swatch} ${s.open}`} aria-hidden="true" /> Kinds of
        role and jobs (filled: strongest fit)
      </li>
    </ul>
  );
}

function TreeArea({ tree, onAsk }: { tree: Tree; onAsk: (q: string) => void }) {
  const model = useMemo(() => treeModel(tree), [tree]);
  const [selected, setSelected] = useState<number | null>(null);
  const focus = useMemo(
    () => (selected === null ? null : related(model, selected)),
    [model, selected]
  );
  const node = selected === null ? null : tree.nodes[selected];
  const open = (i: number) => {
    const n = tree.nodes[i];
    if (n?.jobId !== null) window.location.assign(`/jobs/${n.jobId}`);
  };

  return (
    <Stack gap={3} align="stretch">
      <Legend />
      <TreeMap
        className={s.map}
        nodes={model.nodes}
        edges={model.edges}
        bands={model.bands}
        bandLabel={model.bandLabel}
        selected={selected}
        onSelect={setSelected}
        onOpen={open}
        focus={focus}
        label="Your career tree: skills at the bottom, jobs at the top"
      />
      {node ? (
        <Card aria-live="polite">
          <CardContent>
            <Stack gap={2} align="start">
              <Badge tone={node.kind === 'gap' ? 'warning' : 'neutral'}>
                {KIND[node.kind]}
              </Badge>
              <Text weight="semibold">{node.label}</Text>
              {node.detail ? (
                <Text size="sm" tone="muted">
                  {node.detail}
                </Text>
              ) : null}
              <div className={s.actions}>
                {node.jobId !== null ? (
                  <Button asChild size="sm" variant="primary">
                    <a href={`/jobs/${node.jobId}`}>Open the job</a>
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onAsk(question(node))}
                >
                  Ask the copilot
                </Button>
              </div>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Text size="sm" tone="muted">
          Each square rests on what’s below it. Pick one to see what it stands
          on; zoom in for names. Big amber squares are the skills that would
          open the most jobs.
        </Text>
      )}
    </Stack>
  );
}

const question = (n: Tree['nodes'][number]) =>
  n.kind === 'job' && n.jobId !== null
    ? `How well do I fit job ${n.jobId} (${n.label}), and what should I say when I apply?`
    : n.kind === 'gap'
    ? `Jobs that fit me ask for ${n.label}. How could I show it, or learn it quickly?`
    : n.kind === 'direction'
    ? `Tell me about moving into ${n.label.toLowerCase()} roles from where I am.`
    : `How should my resume present ${n.label}?`;

/** Pathways → Tree: the career tree, from skills up to jobs. */
export function CareerTree({ onAsk }: { onAsk: (q: string) => void }) {
  const result = useAtomValue(careerTreeAtom);
  if (AsyncResult.isFailure(result)) {
    return errorTag(Exit.failCause(result.cause)) === 'NoResume' ? (
      <EmptyState title="Add your resume first">
        The tree grows from your resume’s skills and experience.
      </EmptyState>
    ) : (
      <Callout tone="danger" title="The tree didn’t load">
        Reload the page to try again.
      </Callout>
    );
  }
  if (!AsyncResult.isSuccess(result)) {
    return <Skeleton height="60vh" aria-label="Growing your tree" />;
  }
  return result.value.nodes.length === 0 ? (
    <EmptyState title="Nothing to grow yet">
      No open jobs fit your resume well enough yet. Add skills and experience,
      or check back after the next “Who is hiring?” thread.
    </EmptyState>
  ) : (
    <TreeArea tree={result.value} onAsk={onAsk} />
  );
}
