import { TestDatabase } from '@repo/database/testing';
import {
  embedderFrom,
  JobFitter,
  JobMatcher,
  noPreferences,
  PreferenceStore,
} from '@repo/jobs';
import { Duration, Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { JobDecisions } from './decisions';
import { InsightReader } from './insightReader';
import { JobRolesLive } from './jobRoles';
import { ResumeInsightsLive } from './resumeInsights';
import { SkillCatalogLive } from './skills';
import { reading, resume } from './test/fakes';
import { posting } from './test/fixtures';

const vector = () => {
  const v = new Float32Array(3072);
  v[0] = 1;
  return v;
};

/** JobDecisions on PGlite with instant fake models. */
const layer = JobDecisions.layer.pipe(
  Layer.provideMerge(
    Layer.mergeAll(
      ResumeInsightsLive,
      JobRolesLive,
      JobMatcher.layer,
      PreferenceStore.layer
    )
  ),
  Layer.provideMerge(SkillCatalogLive),
  Layer.provideMerge(
    Layer.mergeAll(
      TestDatabase,
      embedderFrom(vector),
      Layer.succeed(
        JobFitter,
        JobFitter.of({
          fit: (_, jobs) =>
            Effect.succeed(
              jobs.map((j) => ({
                id: j.id,
                score: 85,
                role: 'Platform engineer',
                why: 'You ran Kubernetes',
              }))
            ),
        })
      ),
      Layer.succeed(
        InsightReader,
        InsightReader.of({ read: () => Effect.succeed(reading) })
      )
    )
  )
);

/** Three open jobs, the first in adtech, and a user. */
const seed = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const jobs = [
    {
      id: 1,
      p: posting({
        company: 'Ads Co',
        skills: [{ name: 'Kubernetes', keywords: [] }],
      }),
    },
    {
      id: 2,
      p: posting({
        company: 'Rust Co',
        skills: [
          { name: 'Kubernetes', keywords: [] },
          { name: 'Elixir', keywords: [] },
        ],
      }),
    },
    {
      id: 3,
      p: posting({
        company: 'Office Co',
        remote: 'onsite',
        skills: [{ name: 'Go', keywords: [] }],
      }),
    },
  ];
  for (const { id, p } of jobs) {
    yield* sql`
      INSERT INTO app.jobs (id, thread_id, author, html, posted_at, parsed, parsed_at, embedding)
      VALUES (${id}, 1, 'hn', ${`${p.company}: ${p.title}`}, now() - interval '1 day',
              ${JSON.stringify(p)}::jsonb, now(), ${new Uint8Array(
      vector().buffer
    )})`;
  }
  yield* sql`
    INSERT INTO app.job_facts (job_id, facts, model)
    VALUES (1, ${JSON.stringify({
      sectors: ['adtech_marketing'],
      stage: 'growth',
      teamSize: null,
      signals: [],
    })}, 'facts-1')`;
  const [user] = yield* sql<{ id: string }>`
    INSERT INTO app.users (email) VALUES ('ada@example.com') RETURNING id`;
  return user?.id ?? '';
});

const run = <A>(
  effect: Effect.Effect<
    A,
    unknown,
    JobDecisions | PreferenceStore | JobMatcher | SqlClient.SqlClient
  >
) => Effect.runPromise(effect.pipe(Effect.provide(layer)));

describe('job decisions', () => {
  it('decides every job from the resume, the fits and what the person wants', async () => {
    const [plain, wanting] = await run(
      Effect.gen(function* () {
        const userId = yield* seed;
        const decisions = yield* JobDecisions;
        const plain = yield* decisions.decisions(
          userId,
          resume,
          Duration.seconds(5)
        );
        yield* (yield* PreferenceStore).save(
          userId,
          {
            ...noPreferences,
            workplaces: ['remote_global'],
            avoidSectors: ['adtech_marketing'],
          },
          'you'
        );
        return [
          plain,
          yield* decisions.decisions(userId, resume, Duration.seconds(5)),
        ] as const;
      })
    );
    expect(plain.stated).toBe(false);
    expect(plain.waitingFor).toEqual([]);
    expect(plain.jobs).toHaveLength(3);
    const rust = plain.jobs.find((j) => j.company === 'Rust Co');
    expect(rust?.decision.shown).toEqual(['Kubernetes']);
    expect(rust?.decision.missing).toEqual(['Elixir']);

    expect(wanting.stated).toBe(true);
    const verdicts = Object.fromEntries(
      wanting.jobs.map((j) => [
        j.company,
        [j.decision.verdict, j.decision.reasons[0]?.text],
      ])
    );
    expect(verdicts['Ads Co']).toEqual([
      'ruled_out',
      'Adtech and marketing, which you avoid',
    ]);
    expect(verdicts['Office Co']).toEqual([
      'ruled_out',
      'In an office; you want remote work anywhere',
    ]);
    expect(wanting.jobs.at(-1)?.decision.verdict).toBe('ruled_out');
  });

  it('keeps decisions, records marks against them, and learns suggestions', async () => {
    const result = await run(
      Effect.gen(function* () {
        const userId = yield* seed;
        const sql = yield* SqlClient.SqlClient;
        const decisions = yield* JobDecisions;
        yield* decisions.decisions(userId, resume, Duration.seconds(5));
        // Kept in the background.
        yield* Effect.sleep(Duration.millis(200));
        const kept = yield* sql<{
          n: number;
        }>`SELECT count(*)::int AS n FROM app.job_decisions`;
        const matcher = yield* JobMatcher;
        const shown = yield* matcher.mark(userId, 1, 'not_interested', null, {
          reason: 'sector',
          source: 'jobs',
          position: 0,
        });
        for (const id of [4, 5]) {
          yield* sql`
            INSERT INTO app.jobs (id, thread_id, author, html, posted_at, parsed, parsed_at)
            VALUES (${id}, 1, 'hn', 'Ad', now(), ${JSON.stringify(
            posting()
          )}::jsonb, now())`;
          yield* sql`
            INSERT INTO app.job_facts (job_id, facts, model)
            VALUES (${id}, ${JSON.stringify({
            sectors: ['adtech_marketing'],
            stage: 'unspecified',
            teamSize: null,
            signals: [],
          })}, 'facts-1')`;
          yield* matcher.mark(userId, id, 'not_interested', null, {
            reason: 'sector',
          });
        }
        const events = yield* sql<{ reason: string; source: string }>`
          SELECT reason, source FROM app.job_mark_events ORDER BY created_at`;
        const later = yield* decisions.decisions(
          userId,
          resume,
          Duration.seconds(5)
        );
        return {
          kept: kept[0]?.n,
          shown,
          events,
          suggestions: later.suggestions,
        };
      })
    );
    expect(result.kept).toBe(3);
    expect(result.shown.verdict).toMatch(/apply|stretch|skip/);
    expect(result.shown.chance).toBeGreaterThan(0);
    expect(result.events).toHaveLength(3);
    expect(result.events[0]).toEqual({ reason: 'sector', source: 'jobs' });
    expect(result.suggestions.map((s) => s.id)).toEqual([
      'avoid:adtech_marketing',
    ]);
  });
});
