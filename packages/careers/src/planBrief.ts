import type { buildGraph } from './graph/build';
import type { GraphInputs } from './graph/inputs';
import type { PlanBrief } from './planner';
import type { Archetype } from './services';

/** What the planner is told about a destination, from the graph and its inputs. */
export const planBrief = (
  destination: string,
  input: GraphInputs,
  built: ReturnType<typeof buildGraph>,
  archetype: Archetype | undefined
): PlanBrief => ({
  destination,
  strengths: input.insight.strengths.map((s) => `${s.name}: ${s.summary}`),
  skills: [...new Set(input.insight.evidence.map((e) => e.skill.name))],
  gaps: built.nodes.filter((n) => n.kind === 'gap').map((n) => n.label),
  asks: archetype?.skills.slice(0, 12).map((s) => s.skill.name) ?? [],
  jobs: input.jobs.slice(0, 15).map((j) => ({
    id: j.ranked.row.id,
    company: j.ranked.row.posting.company,
    title: j.role?.title ?? j.ranked.row.posting.title,
    score: j.ranked.score,
  })),
  history: input.insight.entries
    .filter((e) => e.section === 'work')
    .map(
      (e) =>
        `${e.detail ?? ''} at ${e.label} (${e.startYear ?? '?'}–${
          e.endYear ?? 'now'
        })`
    ),
});
