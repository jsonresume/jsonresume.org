import type { CareerNode } from '@repo/api';
import { familyName } from '../families';
import type { Draft } from './draft';
import { seniorityLevel, type GraphInputs, type GraphJob } from './inputs';
import type { buildYou } from './buildYou';

/** Missing skills shown: those the shown jobs need most. */
const GAPS = 16;
const usd = (n: number) => `$${Math.round(n / 1000)}k`;

const missingOf = (job: GraphJob, have: ReadonlyMap<number, number>) =>
  job.requirements.filter(
    (r) => r.need === 'required' && !have.has(r.skill.id)
  );

const jobTone = (job: GraphJob, missing: number): CareerNode['tone'] =>
  job.ranked.mark === 'applied'
    ? 'active'
    : missing === 0 && job.ranked.score >= 70
    ? 'success'
    : missing <= 1
    ? 'closable'
    : 'open';

/**
 * What's open: kinds of role (from the jobs' role families), the jobs (each
 * resting on its kind of role, the skills it needs that you show, and the
 * ones you don't yet), where people in your role went next, and your
 * plan's steps.
 */
export const buildOpen = (
  g: Draft,
  input: GraphInputs,
  you: ReturnType<typeof buildYou>
) => {
  const { have, entryNode, strengths, time } = you;
  const archetype = new Map(input.archetypes.map((a) => [a.family, a]));

  // Missing skills, by how much the shown jobs need them.
  const need = new Map<number, { name: string; score: number; jobs: number }>();
  for (const job of input.jobs) {
    for (const r of job.requirements) {
      if (have.has(r.skill.id)) continue;
      const was = need.get(r.skill.id) ?? {
        name: r.skill.name,
        score: 0,
        jobs: 0,
      };
      need.set(r.skill.id, {
        name: r.skill.name,
        score: was.score + (r.need === 'required' ? 1 : 0.5),
        jobs: was.jobs + 1,
      });
    }
  }
  const gaps = new Map(
    [...need.entries()]
      .filter(([, n]) => n.score >= 1.5)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, GAPS)
      .map(([id, n]) => [
        id,
        g.add({
          id: `gap:${id}`,
          kind: 'gap',
          label: n.name,
          detail: `${n.jobs} of these jobs ask for it; your resume doesn’t show it yet`,
          tone: 'attention',
          levels: { meaning: 1, distance: 1 },
        }),
      ])
  );

  for (const job of input.jobs) {
    const { ranked: r, family } = job;
    const a = archetype.get(family);
    const dir = g.add({
      id: `direction:${family}`,
      kind: 'direction',
      label: a?.name ?? familyName(family),
      detail: a
        ? [
            `${a.roles} open roles`,
            a.payP50 ? `median ${usd(a.payP50)}` : null,
            `${a.remoteShare}% remote`,
          ]
            .filter(Boolean)
            .join(' · ')
        : null,
      tone: 'open',
      levels: { meaning: 4 },
    });
    const missing = missingOf(job, have).length;
    const title = job.role?.title ?? r.role ?? r.row.posting.title;
    const node = g.add({
      id: `job:${r.row.id}`,
      kind: 'job',
      label: r.row.posting.company || title,
      detail: `${title} · ${r.score}% fit · ${
        missing === 0
          ? 'you show every skill it requires'
          : `${missing} required skill${missing === 1 ? '' : 's'} to show`
      }`,
      tone: jobTone(job, missing),
      levels: {
        meaning: 5,
        distance: 2 + Math.min(missing, 2),
        seniority: seniorityLevel(
          job.role?.seniority ?? r.row.posting.seniority
        ),
        time: time.last + 1,
      },
      jobId: r.row.id,
      score: r.score,
    });
    g.link(dir, node, 1);
    for (const req of job.requirements) {
      const weight = req.need === 'required' ? 1 : 0.5;
      g.link(have.get(req.skill.id) ?? gaps.get(req.skill.id), node, weight);
    }
  }

  // Kinds of role rest on the experience in them and the strengths they draw on.
  for (const e of input.insight.entries) {
    if (!e.family) continue;
    g.link(
      entryNode.get(e.key),
      g.at(`direction:${e.family}`),
      1,
      `You worked as ${e.detail ?? e.label}`
    );
  }
  for (const { node, strength } of strengths) {
    for (const a of input.archetypes) {
      const shared = a.skills.filter((s) =>
        strength.skills.includes(s.skill.id)
      );
      if (shared.length >= 2)
        g.link(node, g.at(`direction:${a.family}`), 0.7, strength.summary);
    }
  }

  return { gaps };
};
