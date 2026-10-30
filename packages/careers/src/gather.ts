import { familyOf, type Ranked } from '@repo/jobs';
import { Effect } from 'effect';
import { familyName, isFamily, type Family } from './families';
import type { GraphInputs, GraphJob } from './graph/inputs';
import { PlanStore } from './plans';
import {
  CareerMoves,
  JobRoles,
  ResumeInsights,
  SkillCatalog,
  type JobRole,
} from './services';

/** Jobs on the graph: the best fits, at least this fit. */
const JOBS = 60;
const MIN_FIT = 45;
const DESTINATIONS = 5;

/** The jobs package's kinds of role, for posts not yet read into roles. */
const FROM_KIND: Record<string, Family> = {
  'AI and machine learning': 'ai',
  'Engineering leadership': 'eng_manager',
  'Staff and principal engineer': 'architect',
  'Data engineering': 'data_engineering',
  'Data science and analytics': 'data_science',
  'Infrastructure and DevOps': 'platform',
  Security: 'security',
  Mobile: 'mobile',
  Frontend: 'frontend',
  Backend: 'backend',
  'Full-stack and product engineering': 'fullstack',
  'Embedded and hardware': 'embedded',
  Design: 'design',
  'Product management': 'product',
  'Sales, success and operations': 'non_tech',
  'Software engineering': 'fullstack',
  'Founding engineer': 'fullstack',
};

/** The post's role that fits: the one the matcher named, else the first. */
const pickRole = (roles: ReadonlyArray<JobRole>, named: string | null) => {
  const want = named?.toLowerCase() ?? '';
  return (
    roles.find(
      (r) =>
        want &&
        (want.includes(r.title.toLowerCase()) ||
          r.title.toLowerCase().includes(want))
    ) ??
    roles[0] ??
    null
  );
};

/**
 * Everything the career graph is built from, for a resume and its owner:
 * the resume read into evidence, the best-fitting jobs with the role in
 * each that fits and what it requires, role families, where people in the
 * current role went next, and the latest plan.
 */
export const gather = Effect.fn('Careers.gather')(function* (
  userId: string,
  resume: unknown,
  ranked: ReadonlyArray<Ranked>,
  year: number
) {
  const insights = yield* ResumeInsights;
  const roles = yield* JobRoles;
  const catalog = yield* SkillCatalog;
  const moves = yield* CareerMoves;
  const plans = yield* PlanStore;

  const insight = yield* insights.insight(resume);
  const shown = ranked
    .filter((r) => r.mark !== 'not_interested' && r.score >= MIN_FIT)
    .slice(0, JOBS);
  const roleMap = yield* roles.rolesOf(shown.map((r) => r.row.id));
  const unread = shown.filter((r) => !roleMap.get(r.row.id)?.length);
  const names = [
    ...new Set(unread.flatMap((r) => r.row.posting.skills.map((s) => s.name))),
  ];
  const resolved = names.length > 0 ? yield* catalog.resolve(names) : new Map();

  const jobs = shown.map((r): GraphJob => {
    const role = pickRole(roleMap.get(r.row.id) ?? [], r.role);
    return {
      ranked: r,
      role,
      family:
        role?.family ??
        FROM_KIND[familyOf(r.role ?? r.row.posting.title)] ??
        'other_tech',
      requirements: role
        ? role.requirements
        : r.row.posting.skills.flatMap((s) => {
            const skill = resolved.get(s.name);
            return skill
              ? [{ skill, need: 'required' as const, years: null }]
              : [];
          }),
    };
  });

  const work = insight.entries.filter((e) => e.section === 'work' && e.family);
  const current = work.find((e) => e.endYear === null) ?? work[0];
  const next =
    current?.family && current.seniority
      ? yield* moves.from(current.family, current.seniority)
      : [];
  const plan = yield* plans.latest(userId);

  const input: GraphInputs = {
    insight,
    jobs,
    archetypes: yield* roles.archetypes,
    destinations: next
      .slice(0, DESTINATIONS)
      .map((m) => ({ ...m, name: familyName(m.family) })),
    plan: plan && {
      id: plan.id,
      family: plan.family && isFamily(plan.family) ? plan.family : null,
      steps: plan.steps.map((s) => ({
        id: s.id,
        kind: s.kind,
        title: s.title,
        detail: s.detail,
        skillId: plan.stepSkills.get(s.id) ?? null,
        jobId: s.jobId,
        done: s.done,
      })),
    },
    year,
  };
  return input;
});
