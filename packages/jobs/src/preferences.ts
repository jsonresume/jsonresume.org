import { JobPreferences } from '@repo/api';
import { Context, Effect, Layer, Predicate, Schema } from 'effect';
import { SqlClient } from 'effect/sql';

/** Where a change to preferences came from. */
export type PreferenceSource = 'you' | 'suggestion' | 'agent' | 'interview';

const Row = Schema.Struct({
  preferences: Schema.fromJsonString(JobPreferences),
});
const rows = Schema.decodeUnknownEffect(Schema.Array(Row));
const encode = Schema.encodeSync(Schema.fromJsonString(JobPreferences));
const decode = Schema.decodeUnknownSync(JobPreferences);

/** Nothing stated: every key empty. */
export const noPreferences: JobPreferences = decode({});

const clean = (p: JobPreferences): JobPreferences => {
  const words = (list: ReadonlyArray<string>) => [
    ...new Set(
      list
        .map((w) => w.trim())
        .filter(Boolean)
        .slice(0, 30)
    ),
  ];
  const pay = (n: number | null) =>
    n !== null && Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  return {
    ...p,
    workplaces: [...new Set(p.workplaces)],
    employment: [...new Set(p.employment)],
    levels: [...new Set(p.levels)],
    avoidSectors: [...new Set(p.avoidSectors)],
    likeSectors: [...new Set(p.likeSectors)],
    stages: [...new Set(p.stages)],
    payFloor: pay(p.payFloor),
    payTarget: pay(p.payTarget),
    wantSkills: words(p.wantSkills),
    avoidSkills: words(p.avoidSkills),
    direction: p.direction.trim().slice(0, 500),
    priorities: [...new Set(p.priorities)].slice(0, 3),
    dismissed: words(p.dismissed),
  };
};

/**
 * Where someone wants to go, in words: the direction they stated, else their
 * resume's `objective` (the schema's forward-looking goal, which few themes
 * show). Jobs are ranked toward it, and it weighs on each job's appeal.
 */
export const directionOf = (p: JobPreferences, resume: unknown): string => {
  if (p.direction) return p.direction;
  const objective =
    Predicate.isObject(resume) && 'objective' in resume
      ? resume.objective
      : undefined;
  return Predicate.isString(objective) ? objective.trim().slice(0, 500) : '';
};

/** Whether someone has said anything about what they want. */
export const isStated = (p: JobPreferences) =>
  encode(clean({ ...p, dismissed: [] })) !==
  encode({ ...noPreferences, dismissed: [] });

/**
 * Which preferences are set, for analytics: the chosen options (fixed
 * vocabularies) and counts, never pay amounts, skills or the words they wrote.
 */
export const preferenceSummary = (p: JobPreferences) => ({
  workplaces: p.workplaces.join(',') || null,
  pay_floor: p.payFloor !== null,
  pay_target: p.payTarget !== null,
  employment: p.employment.join(',') || null,
  levels: p.levels.join(',') || null,
  avoid_sectors: p.avoidSectors.join(',') || null,
  like_sectors: p.likeSectors.join(',') || null,
  stages: p.stages.join(',') || null,
  want_skills: p.wantSkills.length,
  avoid_skills: p.avoidSkills.length,
  direction: p.direction.length > 0,
  priorities: p.priorities.join(',') || null,
  needs_visa: p.needsVisa,
});

/** What each person wants from their next job, and every change to it. */
export class PreferenceStore extends Context.Service<
  PreferenceStore,
  {
    get(userId: string): Effect.Effect<JobPreferences>;
    save(
      userId: string,
      preferences: JobPreferences,
      source: PreferenceSource
    ): Effect.Effect<JobPreferences>;
  }
>()('@repo/jobs/PreferenceStore') {
  static readonly layer = Layer.effect(
    PreferenceStore,
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;
      const get = Effect.fn('Preferences.get')(function* (userId: string) {
        const [row] = yield* sql`
          SELECT preferences::text AS preferences FROM app.job_preferences
          WHERE user_id = ${userId}
        `.pipe(Effect.flatMap(rows), Effect.orDie);
        return row?.preferences ?? noPreferences;
      });
      const save = Effect.fn('Preferences.save')(function* (
        userId: string,
        preferences: JobPreferences,
        source: PreferenceSource
      ) {
        const saved = clean(preferences);
        const json = encode(saved);
        yield* sql
          .withTransaction(
            sql`
            INSERT INTO app.job_preferences (user_id, preferences)
            VALUES (${userId}, ${json})
            ON CONFLICT (user_id) DO UPDATE
              SET preferences = EXCLUDED.preferences, updated_at = now()
          `.pipe(
              Effect.andThen(sql`
              INSERT INTO app.job_preference_changes (user_id, preferences, source)
              VALUES (${userId}, ${json}, ${source})
            `)
            )
          )
          .pipe(Effect.orDie);
        return saved;
      });
      return PreferenceStore.of({ get, save });
    })
  );
}
