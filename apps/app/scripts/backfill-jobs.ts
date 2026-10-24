/**
 * One-off, run on the box when jobs moved from the registry (2026-10-24):
 * copies public.jobs (the registry's table, restored from Supabase) into
 * app.jobs, mapping its parsed JSON to Postings (fromLegacy) and finding
 * each post's thread from HN's list of "Who is hiring?" threads. Embeddings
 * are not copied (they were made from model filler text); run the pipeline
 * with JOBS_DAYS=365 afterwards to embed and group them.
 *
 *   vite build --ssr scripts/backfill-jobs.ts --outDir <dir> && node <dir>/backfill-jobs.js
 */
import { NodeRuntime } from '@effect/platform-node';
import { PgLive } from '@repo/database';
import { fromLegacy, HackerNews, type Thread } from '@repo/jobs';
import { Effect, Layer, Option, Schema } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { SqlClient } from 'effect/sql';

const Legacy = Schema.Struct({
  id: Schema.String,
  content: Schema.NullOr(Schema.String),
  raw: Schema.NullOr(Schema.String),
  posted_at: Schema.Date,
  gpt_content: Schema.NullOr(Schema.String),
  salary_min: Schema.NullOr(Schema.Number),
  salary_max: Schema.NullOr(Schema.Number),
});
const Raw = Schema.fromJsonString(
  Schema.Struct({ author: Schema.optional(Schema.String) })
);

const threadOf = (threads: ReadonlyArray<Thread>, postedAt: Date) =>
  threads.find((t) => t.postedAt.getTime() <= postedAt.getTime() + 60_000);

const main = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const hn = yield* HackerNews;
  const threads = yield* hn.threads(100);
  const rows = yield* sql`
    SELECT uuid AS id, content, raw, coalesce(posted_at, created_at) AS posted_at,
           gpt_content, salary_min, salary_max
    FROM public.jobs
    WHERE type = 'hackernews' AND uuid ~ '^[0-9]+$'
  `.pipe(Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Legacy))));

  let copied = 0;
  let unparsed = 0;
  for (const row of rows) {
    const thread = threadOf(threads, row.posted_at);
    if (!thread || !row.content) continue;
    const author = Option.match(Schema.decodeUnknownOption(Raw)(row.raw), {
      onNone: () => 'unknown',
      onSome: (r) => r.author ?? 'unknown',
    });
    const posting = Option.map(
      row.gpt_content ? fromLegacy(row.gpt_content) : Option.none(),
      (p) => ({
        ...p,
        salaryMin: p.salaryMin ?? row.salary_min,
        salaryMax: p.salaryMax ?? row.salary_max,
      })
    );
    if (Option.isNone(posting)) unparsed++;
    yield* sql`
      INSERT INTO app.jobs (id, thread_id, author, html, posted_at, parsed, parsed_at)
      VALUES (${Number(row.id)}, ${thread.id}, ${author}, ${row.content.replace(
      /\0/g,
      ''
    )}, ${row.posted_at},
              ${Option.match(posting, {
                onNone: () => null,
                // Postgres rejects NUL in jsonb and text.
                onSome: (p) => JSON.stringify(p).replace(/\\u0000/g, ''),
              })}::jsonb,
              ${Option.isSome(posting) ? new Date() : null})
      ON CONFLICT (id) DO NOTHING
    `;
    copied++;
  }
  yield* Effect.logInfo('backfilled jobs', {
    rows: rows.length,
    copied,
    unparsed,
    threads: threads.length,
  });
});

NodeRuntime.runMain(
  main.pipe(
    Effect.provide(
      Layer.mergeAll(
        PgLive,
        HackerNews.layer.pipe(Layer.provide(FetchHttpClient.layer))
      )
    )
  )
);
