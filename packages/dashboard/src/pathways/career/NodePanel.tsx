import { Badge, Button, Card, CardContent, Stack, Text } from '@jsonresume/ui';
import type { CareerGraph, CareerNode } from '@repo/api';
import type { MapModel } from './mapModel';
import * as s from './career.css';

const KIND: Record<CareerNode['kind'], string> = {
  foundation: 'Foundation',
  skill: 'A skill you show',
  gap: 'A skill to show',
  evidence: 'Your experience',
  strength: 'A strength',
  direction: 'A kind of role',
  job: 'A job',
  destination: 'Where people go next',
  step: 'A step in your plan',
};

const question = (n: CareerNode) =>
  n.kind === 'job' && n.jobId !== null
    ? `How well do I fit job ${n.jobId} (${n.label}), and what should I say when I apply?`
    : n.kind === 'gap'
    ? `Jobs that fit me ask for ${n.label}. How could I show it, or learn it quickly?`
    : n.kind === 'destination'
    ? `What would it take for me to become ${n.label}?`
    : n.kind === 'direction'
    ? `Tell me about moving into ${n.label.toLowerCase()} roles from where I am.`
    : `How should my resume present ${n.label}?`;

/** The picked square: what it is, what holds it up (in the resume's words), what to do. */
export function NodePanel({
  graph,
  model,
  index,
  onAsk,
  onPlan,
  planning,
}: {
  graph: CareerGraph;
  model: MapModel;
  index: number;
  onAsk: (q: string) => void;
  onPlan: (destination: string) => void;
  planning: boolean;
}) {
  const node = graph.nodes[model.source[index] ?? -1];
  if (!node) return null;
  const reasons = [...(model.below[index] ?? [])]
    .sort((a, b) => b.edge.weight - a.edge.weight)
    .flatMap(({ from, edge }) => {
      const under = graph.nodes[model.source[from] ?? -1];
      return under ? [{ label: under.label, why: edge.why, id: under.id }] : [];
    })
    .slice(0, 6);
  return (
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
          {reasons.length > 0 ? (
            <ul className={s.reasons} aria-label="What it rests on">
              {reasons.map((r) => (
                <li key={r.id}>
                  <strong>{r.label}</strong>
                  {r.why ? <span className={s.quote}> “{r.why}”</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          <div className={s.actions}>
            {node.jobId !== null && node.kind === 'job' ? (
              <Button asChild size="sm" variant="primary">
                <a href={`/jobs/${node.jobId}`}>Open the job</a>
              </Button>
            ) : null}
            {node.kind === 'destination' ? (
              <Button
                size="sm"
                variant="primary"
                disabled={planning}
                onClick={() => onPlan(node.id)}
              >
                {planning ? 'Planning…' : 'Plan a path here'}
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
  );
}
