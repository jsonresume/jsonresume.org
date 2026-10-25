import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { expect, it } from 'vitest';
import { fitScore, JobMatcher } from './matcher';
import { runPipeline } from './pipeline';
import { JobStore } from './store';
import {
  daysAgo,
  FakeEmbedder,
  fakeHackerNews,
  FakeParser,
  post,
} from './test/fixtures';

const thread = {
  id: 1,
  title: 'Ask HN: Who is hiring? (October 2026)',
  postedAt: daysAgo(10),
};
const hn = {
  threads: [thread],
  posts: {
    1: [
      post(11, 1, 'Rust Engineer | Ferrous | Rust Tokio Linux', daysAgo(9)),
      post(12, 1, 'React Engineer | Webby | React TypeScript CSS', daysAgo(9)),
      post(13, 1, 'Data Scientist | Numbers | Python Pandas SQL', daysAgo(9)),
    ],
  },
};
const layer = Layer.mergeAll(JobStore.layer, JobMatcher.layer).pipe(
  Layer.provideMerge(
    Layer.mergeAll(fakeHackerNews(hn), FakeParser, FakeEmbedder, TestDatabase)
  )
);
const resume = {
  basics: { label: 'Frontend developer' },
  skills: [{ name: 'React', keywords: ['TypeScript', 'CSS'] }],
};

it('ranks open jobs against a resume, and remembers marks', async () => {
  const [first, marked, none] = await Effect.runPromise(
    Effect.gen(function* () {
      yield* runPipeline({
        threads: 1,
        parseLimit: 10,
        days: 120,
        concurrency: 1,
      });
      const sql = yield* SqlClient.SqlClient;
      const [user] = yield* sql<{ id: string }>`
        INSERT INTO app.users (email) VALUES ('a@example.com') RETURNING id`;
      const userId = user?.id ?? '';
      const matcher = yield* JobMatcher;
      const first = yield* matcher.matches(userId, resume);
      yield* matcher.mark(userId, 12, 'applied');
      yield* matcher.mark(userId, 13, 'not_interested');
      yield* matcher.mark(userId, 13, null);
      const marked = yield* matcher.matches(userId, resume);
      const none = yield* Effect.flip(matcher.matches(userId, {}));
      return [first, marked, none] as const;
    }).pipe(Effect.provide(layer))
  );
  expect(first[0]?.company).toBe('Webby');
  expect(first.map((j) => j.mark)).toEqual([null, null, null]);
  expect(marked.find((j) => j.id === 12)?.mark).toBe('applied');
  expect(marked.find((j) => j.id === 13)?.mark).toBe(null);
  expect(none._tag).toBe('NoResume');
});

it('turns a cosine into a 0 to 100 fit', () => {
  expect(fitScore(0.1)).toBe(0);
  expect(fitScore(0.5)).toBe(50);
  expect(fitScore(0.9)).toBe(100);
});
