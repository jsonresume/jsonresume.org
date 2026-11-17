/**
 * `pnpm dev` only: with DEV_SEED_DATABASE_URL, copies the open jobs from
 * that database into the in-memory one at startup, then reads their
 * company facts (with OPENAI_API_KEY), so the job pages have real posts.
 * The source is opened read-only (pgReadOnly), checked before reading.
 */
import { ensureReadOnly, pgReadOnly } from '@repo/database';
import { OpenAiJobs, refreshFacts } from '@repo/jobs';
import { Config, Effect, Layer, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';

const Row = Schema.Struct({
  id: Schema.Number,
  thread_id: Schema.Number,
  author: Schema.String,
  html: Schema.String,
  posted_at: Schema.Date,
  parsed: Schema.Unknown,
  embedding: Schema.Uint8Array,
  family_id: Schema.NullOr(Schema.Number),
  family_months: Schema.Number,
});

const read = Effect.gen(function* () {
  const source = yield* SqlClient.SqlClient;
  return yield* source`
    SELECT id::float8 AS id, thread_id::float8 AS thread_id, author, html, posted_at,
           parsed, embedding, family_id::float8 AS family_id, family_months::float8 AS family_months
    FROM app.jobs
    WHERE parsed IS NOT NULL AND embedding IS NOT NULL AND removed_at IS NULL
      AND posted_at >= now() - interval '62 days'
  `.pipe(Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Row))));
});

/** Needs the in-memory SqlClient. */
export const DevSeed = Layer.effectDiscard(
  Effect.gen(function* () {
    const url = yield* Config.option(Config.Redacted('DEV_SEED_DATABASE_URL'));
    if (Option.isNone(url)) return;
    const rows = yield* ensureReadOnly.pipe(
      Effect.andThen(read),
      Effect.provide(pgReadOnly(url.value))
    );
    const target = yield* SqlClient.SqlClient;
    yield* Effect.forEach(
      rows,
      (r) => target`
        INSERT INTO app.jobs (id, thread_id, author, html, posted_at, parsed, parsed_at,
                              embedding, family_id, family_months)
        VALUES (${r.id}, ${r.thread_id}, ${r.author}, ${r.html}, ${r.posted_at},
                ${JSON.stringify(r.parsed)}::jsonb, now(), ${r.embedding},
                ${r.family_id}, ${r.family_months})
        ON CONFLICT (id) DO NOTHING
      `,
      { discard: true }
    );
    const facts = yield* refreshFacts({ concurrency: 6 }).pipe(
      Effect.provide(OpenAiJobs)
    );
    yield* Effect.logInfo('Dev seed: copied open jobs', {
      jobs: rows.length,
      facts: facts.read,
    });
  }).pipe(Effect.orDie)
);
