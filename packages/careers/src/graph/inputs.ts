import type { Seniority } from '@repo/api';
import type { Ranked } from '@repo/jobs';
import { SENIORITY_ORDER, type Family } from '../families';
import type {
  Archetype,
  JobRole,
  Move,
  Requirement,
  ResumeInsight,
} from '../services';

/** A job on the graph: its match, the role in the post that fits, what that role asks. */
export interface GraphJob {
  ranked: Ranked;
  role: JobRole | null;
  family: Family;
  requirements: ReadonlyArray<Requirement>;
}

export interface GraphStep {
  id: string;
  kind: string;
  title: string;
  detail: string;
  skillId: number | null;
  jobId: number | null;
  done: boolean;
}

/** Everything the graph is built from, gathered by the service. */
export interface GraphInputs {
  insight: ResumeInsight;
  jobs: ReadonlyArray<GraphJob>;
  archetypes: ReadonlyArray<Archetype>;
  /** Where people in the resume's current role went next. */
  destinations: ReadonlyArray<Move & { name: string }>;
  plan: {
    id: string;
    family: Family | null;
    steps: ReadonlyArray<GraphStep>;
  } | null;
  /** The current year. */
  year: number;
}

export const seniorityLevel = (s: Seniority | null | undefined) =>
  s && s !== 'unspecified' ? SENIORITY_ORDER.indexOf(s) : null;

/** Two-year spans from the first dated entry: the time view's levels. */
export const timeline = (insight: ResumeInsight, now: number) => {
  const years = insight.entries.flatMap((e) =>
    e.startYear !== null ? [e.startYear] : []
  );
  const first = Math.min(now, ...years);
  const span = (year: number) =>
    Math.floor((Math.max(first, year) - first) / 2);
  const last = span(now);
  const names = Array.from({ length: last + 1 }, (_, i) => {
    const from = first + i * 2;
    return i === last ? `${from}–now` : `${from}–${from + 1}`;
  });
  return { span, last, names: [...names, 'Open now', 'Next'] };
};

/** How much a skill's evidence counts: how deep, and how recent. */
export const evidenceWeight = (
  strength: number,
  lastYear: number | null,
  now: number
) => {
  const age = lastYear === null ? 0 : Math.max(0, now - lastYear);
  const recency = age <= 2 ? 1 : Math.max(0.4, 1 - (age - 2) * 0.075);
  return (strength / 3) * recency;
};
