import { Cause, Clock, Effect, Option } from 'effect';
import { Embedder } from './embedder';
import { repostFamilies } from './families';
import { HackerNews } from './hackerNews';
import { JobParser } from './parser';
import { decodePosting, embeddingText, type Posting } from './posting';
import { JobStore } from './store';
import { fromBytes, toBytes } from './vectors';

export interface PipelineOptions {
  /** How many of the newest threads to import (late posts reach last month's). */
  threads: number;
  /** Most posts parsed in one run. */
  parseLimit: number;
  /** Posts older than this many days are no longer parsed or embedded. */
  days: number;
  concurrency: number;
}

export const defaults: PipelineOptions = {
  threads: 2,
  parseLimit: 400,
  days: 120,
  concurrency: 16,
};

/** Repost families look this far back: a role reposted for months. */
const FAMILY_DAYS = 365;
const EMBED_BATCH = 50;
/**
 * A thread listing missing more posts than this is taken as partial (a
 * search hiccup), not as that many deletions.
 */
const missingAllowed = (known: number) => Math.max(5, known * 0.1);

const daysAgo = (days: number) =>
  Clock.currentTimeMillis.pipe(
    Effect.map((now) => new Date(now - days * 86_400_000))
  );

/**
 * One run of the jobs pipeline: import the newest "Who is hiring?" posts,
 * parse new ones into Postings, embed them, then regroup repost families.
 * Each run is recorded in app.job_runs with its counts, or its error.
 */
export const runPipeline = Effect.fn('Jobs.pipeline')(function* (
  options: PipelineOptions = defaults
) {
  const store = yield* JobStore;
  const hn = yield* HackerNews;
  const parser = yield* JobParser;
  const embedder = yield* Embedder;
  const stats: Record<string, number> = {
    fetched: 0,
    added: 0,
    removed: 0,
    parsed: 0,
    parseFailed: 0,
    embedded: 0,
    families: 0,
  };
  const count = (key: string, n = 1) =>
    Effect.sync(() => {
      stats[key] = (stats[key] ?? 0) + n;
    });
  const runId = yield* store.startRun;

  const importPosts = Effect.gen(function* () {
    for (const thread of yield* hn.threads(options.threads)) {
      const posts = yield* hn.posts(thread);
      yield* count('fetched', posts.length);
      yield* count('added', yield* store.addPosts(posts));
      const known = yield* store.threadSize(thread.id);
      if (known - posts.length <= missingAllowed(known)) {
        const live = posts.map((p) => p.id);
        yield* count('removed', yield* store.markRemoved(thread.id, live));
      }
      yield* Effect.logInfo(`${thread.title}: ${posts.length} posts`);
    }
  });

  const parse = Effect.gen(function* () {
    const since = yield* daysAgo(options.days);
    const rows = yield* store.toParse(options.parseLimit, since);
    yield* Effect.logInfo(`parsing ${rows.length} posts`);
    yield* Effect.forEach(
      rows,
      ({ id, html }) =>
        parser.parse(html).pipe(
          Effect.flatMap((posting) => store.saveParsed(id, posting)),
          Effect.andThen(count('parsed')),
          Effect.catchTag('ParseFailed', (e) =>
            store
              .parseFailed(id, e.message)
              .pipe(
                Effect.andThen(count('parseFailed')),
                Effect.andThen(Effect.logWarning(`job ${id}: ${e.message}`))
              )
          )
        ),
      { concurrency: options.concurrency, discard: true }
    );
  });

  const embedBatch = (since: Date) =>
    Effect.gen(function* () {
      const rows = yield* store.toEmbed(EMBED_BATCH, since);
      const valid = rows.flatMap((row) =>
        Option.match(decodePosting(row.parsed), {
          onNone: () => [],
          onSome: (posting: Posting) => [{ id: row.id, posting }],
        })
      );
      const vectors = yield* embedder.embedMany(
        valid.map((v) => embeddingText(v.posting))
      );
      yield* Effect.forEach(
        valid,
        (v, i) => {
          const vector = vectors[i];
          return vector
            ? store.saveEmbedding(v.id, toBytes(vector))
            : Effect.void;
        },
        { discard: true }
      );
      yield* count('embedded', valid.length);
      // Rows that aren't Postings can't be embedded: stop rather than loop.
      return rows.length === EMBED_BATCH && valid.length > 0;
    });

  const embed = Effect.gen(function* () {
    const since = yield* daysAgo(options.days);
    while (yield* embedBatch(since)) {
      // until every parsed job has a vector
    }
  });

  const regroup = Effect.gen(function* () {
    const rows = yield* store.withVectors(yield* daysAgo(FAMILY_DAYS));
    const families = repostFamilies(
      rows.map((r) => ({
        id: r.id,
        company: r.company,
        postedAt: r.posted_at,
        vector: fromBytes(r.embedding),
      }))
    );
    yield* store.saveFamilies(families);
    yield* count(
      'families',
      families.filter((f) => f.months > 1 && f.id === f.familyId).length
    );
  });

  const exit = yield* Effect.exit(
    importPosts.pipe(
      Effect.andThen(parse),
      Effect.andThen(embed),
      // Families only change when jobs come or go.
      Effect.andThen(
        Effect.suspend(() =>
          (stats.embedded ?? 0) + (stats.removed ?? 0) > 0
            ? regroup
            : Effect.void
        )
      )
    )
  );
  const error =
    exit._tag === 'Failure'
      ? Cause.pretty(exit.cause).slice(0, 2000)
      : undefined;
  yield* store.finishRun(runId, stats, error);
  yield* Effect.logInfo('jobs pipeline finished', { ...stats, error });
  yield* exit;
  return stats;
});
