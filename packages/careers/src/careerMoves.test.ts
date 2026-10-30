import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { expect, it } from 'vitest';
import { CareerMovesLive } from './careerMoves';
import { datedWork, movesOf, refreshMoves, startOf } from './movesRefresh';
import { CareerMoves } from './services';
import { fallbackRole } from './titleFamilies';
import { TitleReader, type ReadTitle } from './titleReader';
import type { Family } from './families';

/** A reader that knows a few titles, and remembers what it was asked. */
const fakeReader = (asked: string[]) =>
  Layer.succeed(
    TitleReader,
    TitleReader.of({
      read: (titles) =>
        Effect.sync(() => {
          asked.push(...titles.map((t) => t.title));
          return titles.map((t): ReadTitle => {
            const family: Family = t.title.includes('manager')
              ? 'eng_manager'
              : t.title.includes('backend')
              ? 'backend'
              : 'fullstack';
            return {
              title: t.title,
              family,
              seniority: t.title.includes('manager')
                ? 'lead_management'
                : t.title.includes('senior')
                ? 'senior'
                : 'mid',
            };
          });
        }),
    })
  );

const job = (position: string, startDate?: string) => ({
  position,
  name: 'Acme',
  ...(startDate && { startDate }),
});

const seed = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const ghost = (username: string, work: unknown[]) =>
    sql`INSERT INTO app.profiles (username, kind, github_id, gist_id, resume, fetched_at)
        VALUES (${username}, 'ghost', ${Math.floor(
      Math.random() * 1e9
    )}, 'g', ${JSON.stringify({ work })}::jsonb, now())`;
  // Two people go backend -> senior backend -> manager; one goes backend -> developer.
  yield* ghost('ada', [
    job('Backend Engineer', '2015-01'),
    job('Senior Backend Engineer', '2018-01'),
    job('Engineering Manager', '2021-01'),
  ]);
  yield* ghost('bob', [
    job('backend engineer', '2016-06'),
    job('Backend developer', '2017-06'),
    job('Senior backend engineer', '2019-06'),
    job('Engineering manager', '2023-06'),
  ]);
  yield* ghost('cy', [
    job('Backend Engineer', '2012'),
    job('Developer', '2014'),
    job('No date'),
  ]);
  // An account's resume, not its ghost or the registry's copy of it.
  const [user] = yield* sql<{ id: string }>`
    INSERT INTO app.users (email) VALUES ('dee@example.com') RETURNING id`;
  yield* sql`INSERT INTO app.profiles (username, kind, user_id, source, stored_resume)
             VALUES ('dee', 'account', ${user?.id ?? ''}, 'stored',
                     ${JSON.stringify({
                       work: [
                         job('Backend Engineer', '2010'),
                         job('Engineering Manager', '2011'),
                       ],
                     })}::jsonb)`;
  // The registry's copy: text, sometimes unreadable, sometimes someone new.
  yield* sql`CREATE TABLE public.resumes (username text, resume text)`;
  yield* sql`INSERT INTO public.resumes VALUES
    ('DEE', ${JSON.stringify({
      work: [job('Backend Engineer', '2010'), job('Data Scientist', '2012')],
    })}),
    ('broken', '{not json'),
    ('eve', ${JSON.stringify({
      work: [
        job('Senior Backend Engineer', '2010'),
        job('Engineering Manager', '2012'),
      ],
    })})`;
});

const run = <A, E>(
  effect: Effect.Effect<A, E, SqlClient.SqlClient | TitleReader | CareerMoves>,
  asked: string[]
) =>
  Effect.runPromise(
    effect.pipe(
      Effect.provide(
        CareerMovesLive.pipe(
          Layer.provideMerge(Layer.mergeAll(fakeReader(asked), TestDatabase))
        )
      )
    )
  );

it('learns where people go next, once per person, from dated jobs', async () => {
  const asked: string[] = [];
  const [stats, fromBackend, fromSenior] = await run(
    Effect.gen(function* () {
      yield* seed;
      const stats = yield* refreshMoves;
      const moves = yield* CareerMoves;
      return [
        stats,
        yield* moves.from('backend', 'mid'),
        yield* moves.from('backend', 'senior'),
      ] as const;
    }),
    asked
  );
  expect(stats).toMatchObject({ people: 5, withMoves: 5, read: stats.titles });
  // ada and bob (backend developer is backend too) to senior backend; dee to
  // manager (not data science: that's the registry's copy); cy to developer.
  expect(fromBackend.map((m) => [m.family, m.seniority, m.people])).toEqual([
    ['backend', 'senior', 2],
    ['eng_manager', 'lead_management', 1],
    ['fullstack', 'mid', 1],
  ]);
  expect(fromBackend[0]?.share).toBe(50);
  // 3 years (ada) and 3 (bob, from 2016-06 to 2019-06).
  expect(fromBackend[0]?.medianYears).toBe(3);
  // ada, bob and eve.
  expect(fromSenior).toMatchObject([
    { family: 'eng_manager', people: 3, share: 100, basis: 'role' },
  ]);
  // Nobody steps down: senior to mid isn't offered.
  expect(fromSenior.every((m) => m.seniority !== 'mid')).toBe(true);
});

it('reads each title once, then from the table', async () => {
  const asked: string[] = [];
  const [first, again] = await run(
    Effect.gen(function* () {
      const moves = yield* CareerMoves;
      const first = yield* moves.familiesOf([
        'Senior  Backend Engineer',
        'Engineering manager',
      ]);
      const again = yield* moves.familiesOf(['senior backend engineer']);
      return [first, again] as const;
    }),
    asked
  );
  expect(asked).toEqual(['senior backend engineer', 'engineering manager']);
  expect(first.get('Senior  Backend Engineer')).toEqual({
    family: 'backend',
    seniority: 'senior',
  });
  expect(again.get('senior backend engineer')).toEqual({
    family: 'backend',
    seniority: 'senior',
  });
});

it('reads dates and titles as resumes write them', () => {
  expect(startOf('2019')).toBe(Date.UTC(2019, 0, 1));
  expect(startOf('2019-06-15')).toBe(Date.UTC(2019, 5, 15));
  expect(startOf('June 2019')).toBe(null);
  expect(startOf('1890')).toBe(null);
  expect(
    datedWork([job('B', '2020'), job('A', '2010'), job('Undated')]).map(
      (e) => e.title
    )
  ).toEqual(['A', 'B']);
  expect(fallbackRole('Senior Frontend Developer')).toEqual({
    family: 'frontend',
    seniority: 'senior',
  });
  expect(fallbackRole('Co-founder & CTO')).toEqual({
    family: 'founder',
    seniority: 'lead_management',
  });
  expect(fallbackRole('Barista')).toEqual({
    family: 'non_tech',
    seniority: 'unspecified',
  });
  const roles = new Map([
    ['a', { family: 'backend' as const, seniority: 'mid' as const }],
    ['b', { family: 'backend' as const, seniority: 'mid' as const }],
  ]);
  // The same role twice in a row is no move.
  expect(
    movesOf(
      [
        { title: 'a', start: 0 },
        { title: 'b', start: 1 },
      ],
      roles
    )
  ).toEqual([]);
});
