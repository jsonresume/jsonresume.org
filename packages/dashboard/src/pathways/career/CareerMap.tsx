import { useAtomRefresh, useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Callout,
  EmptyState,
  SegmentedControl,
  Select,
  Skeleton,
  Stack,
  Text,
  TreeMap,
} from '@jsonresume/ui';
import type { CareerGraph, CareerView } from '@repo/api';
import {
  careerGraphAtom,
  careerSnapshotAtom,
  createPlanAtom,
  errorTag,
  keys,
} from '@repo/api-client';
import { Exit } from 'effect';
import { AsyncResult } from 'effect/reactivity';
import { useEffect, useMemo, useState } from 'react';
import { mapModel, related } from './mapModel';
import { NodePanel } from './NodePanel';
import { Legend } from './Legend';
import { PlanPanel } from './PlanPanel';
import * as s from './career.css';

const VIEWS: ReadonlyArray<{ value: CareerView; label: string }> = [
  { value: 'meaning', label: 'Meaning' },
  { value: 'distance', label: 'Distance' },
  { value: 'seniority', label: 'Seniority' },
  { value: 'time', label: 'Time' },
];
const isView = (v: string): v is CareerView => VIEWS.some((x) => x.value === v);

export function CareerArea({
  graph,
  month,
  onMonth,
  onAsk,
}: {
  graph: CareerGraph;
  month: string | null;
  onMonth: (m: string | null) => void;
  onAsk: (q: string) => void;
}) {
  const [view, setView] = useState<CareerView>('meaning');
  const [minFit, setMinFit] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const create = useAtomSet(createPlanAtom, { mode: 'promiseExit' });
  const [planning, setPlanning] = useState(false);
  const phone = typeof window !== 'undefined' && window.innerWidth < 640;
  const model = useMemo(
    () => mapModel(graph, { view, minFit, ...(phone && { aspect: 0.75 }) }),
    [graph, view, minFit, phone]
  );
  useEffect(() => setSelected(null), [model]);
  const focus = useMemo(
    () => (selected === null ? null : related(model, selected)),
    [model, selected]
  );
  const plan = async (destination: string) => {
    setPlanning(true);
    await create({ payload: { destination }, reactivityKeys: keys.career });
    setPlanning(false);
  };
  const open = (i: number) => {
    const n = graph.nodes[model.source[i] ?? -1];
    if (n?.kind === 'job' && n.jobId !== null)
      window.location.assign(`/jobs/${n.jobId}`);
  };

  return (
    <Stack gap={3} align="stretch">
      <div className={s.controls}>
        <SegmentedControl
          label="Arrange by"
          options={VIEWS.map((v) => ({ ...v }))}
          value={view}
          onValueChange={(v) => isView(v) && setView(v)}
        />
        <Select
          inline
          aria-label="Least fit shown"
          value={String(minFit)}
          onChange={(e) => setMinFit(Number(e.target.value))}
        >
          <option value="0">Every job</option>
          <option value="60">60% fit or more</option>
          <option value="75">75% fit or more</option>
        </Select>
        {graph.snapshots.length > 1 || month ? (
          <Select
            inline
            aria-label="As of"
            value={month ?? ''}
            onChange={(e) => onMonth(e.target.value || null)}
          >
            <option value="">Now</option>
            {graph.snapshots.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        ) : null}
      </div>
      {graph.pending ? (
        <Callout tone="info" title="Still reading your resume">
          The first look takes a minute; the tree fills in as it finishes.
        </Callout>
      ) : null}
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
        label={`Your career graph, by ${view}`}
      />
      {selected !== null ? (
        <NodePanel
          graph={graph}
          model={model}
          index={selected}
          onAsk={onAsk}
          onPlan={plan}
          planning={planning}
        />
      ) : (
        <Text size="sm" tone="muted">
          Each square rests on what’s below it. Pick one to see what holds it
          up, in your resume’s words. Big amber squares are the skills that
          would open the most jobs.
        </Text>
      )}
      {month ? null : <PlanPanel onPlan={plan} planning={planning} />}
    </Stack>
  );
}
