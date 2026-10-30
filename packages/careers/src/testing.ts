import { Effect, Layer, Predicate } from 'effect';
import { CareerGraphs } from './careerGraph';
import { PlanStore } from './plans';
import {
  CareerMoves,
  JobRoles,
  ResumeInsights,
  SkillCatalog,
  type ResumeEntry,
  type Skill,
} from './services';
import { Snapshots } from './snapshots';

/** Skills in memory: one per lower-cased name. */
export const memorySkills = () => {
  const skills = new Map<string, Skill>();
  return Layer.succeed(
    SkillCatalog,
    SkillCatalog.of({
      resolve: (names) =>
        Effect.sync(() => {
          const out = new Map<string, Skill>();
          for (const name of names) {
            const key = name.toLowerCase().trim();
            let skill = skills.get(key);
            if (!skill) {
              skill = { id: skills.size + 1, key, name };
              skills.set(key, skill);
            }
            out.set(name, skill);
          }
          return out;
        }),
      byIds: (ids) =>
        Effect.sync(() =>
          [...skills.values()].filter((s) => ids.includes(s.id))
        ),
    })
  );
};

const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;

/** A resume's work entries as they are, read by nothing. */
export const plainInsights = Layer.succeed(
  ResumeInsights,
  ResumeInsights.of({
    insight: (resume) =>
      Effect.succeed({
        key: 'plain',
        level: 'mid',
        pending: false,
        evidence: [],
        strengths: [],
        foundations: [],
        entries: (Array.isArray(at(resume, 'work'))
          ? (at(resume, 'work') as unknown[])
          : []
        ).map(
          (w, i): ResumeEntry => ({
            key: `work:${i}`,
            section: 'work',
            label: String(at(w, 'name') ?? ''),
            detail: Predicate.isString(at(w, 'position'))
              ? String(at(w, 'position'))
              : null,
            startYear: null,
            endYear: null,
            family: null,
            seniority: null,
          })
        ),
      }),
  })
);

/** No job roles read and no moves known. */
export const noRoles = Layer.succeed(
  JobRoles,
  JobRoles.of({
    rolesOf: () => Effect.succeed(new Map()),
    archetypes: Effect.succeed([]),
  })
);
export const noMoves = Layer.succeed(
  CareerMoves,
  CareerMoves.of({
    from: () => Effect.succeed([]),
    familiesOf: () => Effect.succeed(new Map()),
  })
);

/**
 * CareerGraphs on the database with nothing read by a model, for app tests.
 * Needs a SqlClient and a JobMatcher.
 */
export const plainCareers = CareerGraphs.layer.pipe(
  Layer.provide(
    Layer.mergeAll(
      PlanStore.layer,
      Snapshots.layer,
      plainInsights,
      noRoles,
      noMoves,
      memorySkills()
    )
  )
);
