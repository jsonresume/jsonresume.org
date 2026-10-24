import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { JobBoard } from './board';
import { JobMatcher } from './matcher';
import { runPipeline } from './pipeline';
import { JobStore } from './store';
import {
  daysAgo,
  FakeEmbedder,
  fakeHackerNews,
  FakeParser,
  post,
} from './test/fixtures';

const october = {
  id: 200,
  title: 'Ask HN: Who is hiring? (October 2026)',
  postedAt: daysAgo(20),
};
const september = {
  id: 100,
  title: 'Ask HN: Who is hiring? (September 2026)',
  postedAt: daysAgo(50),
};

const setup = () => {
  const hn = {
    threads: [october, september],
    posts: {
      100: [
        post(101, 100, 'Backend Engineer | Acme | Go Postgres', daysAgo(50)),
        post(102, 100, 'Designer | Paperco | Figma', daysAgo(49)),
      ],
      200: [
        post(
          201,
          200,
          'Backend Engineer | Acme, Inc. | Go Postgres',
          daysAgo(20)
        ),
        post(
          202,
          200,
          'Frontend Engineer | Webby | React TypeScript CSS',
          daysAgo(19)
        ),
        post(203, 200, 'unparseable rambling', daysAgo(19)),
        post(204, 200, 'SEEKING WORK | seeking work, remote', daysAgo(19)),
      ],
    },
  };
  const layer = Layer.mergeAll(
    JobStore.layer,
    JobBoard.layer,
    JobMatcher.layer
  ).pipe(
    Layer.provideMerge(
      Layer.mergeAll(fakeHackerNews(hn), FakeParser, FakeEmbedder, TestDatabase)
    )
  );
  return { hn, layer };
};

const run = runPipeline({
  threads: 2,
  parseLimit: 100,
  days: 120,
  concurrency: 2,
});

describe('the jobs pipeline', () => {
  it('imports, parses, embeds and folds reposts into one family', async () => {
    const { layer } = setup();
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const stats = yield* run;
        const board = yield* (yield* JobBoard).board;
        const status = yield* (yield* JobBoard).status;
        return { stats, board, status };
      }).pipe(Effect.provide(layer))
    );
    expect(result.stats).toMatchObject({
      fetched: 6,
      added: 6,
      parsed: 4,
      notJobs: 1,
      parseFailed: 1,
      embedded: 4,
      families: 1,
    });
    // Acme's repost shows once, as the newest post, in its second month.
    expect(result.board.jobs.map((j) => [j.id, j.months])).toEqual([
      [202, 1],
      [201, 2],
      [102, 1],
    ]);
    expect(result.board.thread).toEqual({
      id: 200,
      title: expect.stringMatching(/^Ask HN: Who is hiring\? \(/),
    });
    expect(result.status.lastRun?.ok).toBe(true);
    expect(result.status.open).toBe(3);
  });

  it('adds nothing twice, retries failures, and drops deleted posts', async () => {
    const { hn, layer } = setup();
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        yield* run;
        hn.posts[200] = (hn.posts[200] ?? []).filter((p) => p.id !== 202);
        const again = yield* run;
        const sql = yield* SqlClient.SqlClient;
        const attempts = yield* sql<{ parse_attempts: number }>`
          SELECT parse_attempts FROM app.jobs WHERE id = 203`;
        const board = yield* (yield* JobBoard).board;
        return { again, attempts, board };
      }).pipe(Effect.provide(layer))
    );
    expect(result.again).toMatchObject({
      added: 0,
      removed: 1,
      parsed: 0,
      parseFailed: 1,
    });
    expect(result.attempts[0]?.parse_attempts).toBe(2);
    expect(result.board.jobs.map((j) => j.id)).toEqual([201, 102]);
  });

  it('serves a job in full, and none for an unknown id', async () => {
    const { layer } = setup();
    const [job, missing] = await Effect.runPromise(
      Effect.gen(function* () {
        yield* run;
        const board = yield* JobBoard;
        return [
          yield* board.job(101),
          yield* Effect.flip(board.job(999)),
        ] as const;
      }).pipe(Effect.provide(layer))
    );
    expect(job).toMatchObject({
      id: 101,
      company: 'Acme',
      closed: true,
      author: 'user101',
    });
    expect(job.post).toEqual(['Backend Engineer | Acme | Go Postgres']);
    expect(missing._tag).toBe('JobNotFound');
  });
});
