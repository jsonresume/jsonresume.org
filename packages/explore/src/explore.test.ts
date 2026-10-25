import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { Explore } from './explore';
import { dropTemplates, toEntry, type Entry } from './listing';
import { search } from './search';

const resume = (name: string, label: string, skills: string[], city = '') => ({
  basics: { name, label, location: { city }, image: 'https://x.com/me.png' },
  skills: [{ name: 'Tech', keywords: skills }],
  work: [{ name: 'Acme', position: label }],
});

const run = <A>(f: (explore: Explore['Service']) => Effect.Effect<A>) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;
      const json = (v: unknown) => JSON.stringify(v);
      yield* sql`
        INSERT INTO app.users (id, email, email_verified_at) VALUES
          ('00000000-0000-0000-0000-000000000001', 'ada@x.com', now()),
          ('00000000-0000-0000-0000-000000000002', 'bo@x.com', NULL),
          ('00000000-0000-0000-0000-000000000003', 'cy@x.com', now())`;
      yield* sql`
        INSERT INTO app.profiles (username, kind, user_id, source, stored_resume, stored_at) VALUES
          ('ada', 'account', '00000000-0000-0000-0000-000000000001', 'stored',
            ${json(
              resume(
                'Ada Lovelace',
                'Engineer',
                ['TypeScript', 'React'],
                'London'
              )
            )}::jsonb, now()),
          ('bo', 'account', '00000000-0000-0000-0000-000000000002', 'stored',
            ${json(
              resume('Bo Unverified', 'Engineer', ['React'])
            )}::jsonb, now()),
          ('cy', 'account', '00000000-0000-0000-0000-000000000003', 'stored',
            ${json(
              resume('Cy Private', 'Designer', ['Figma'])
            )}::jsonb, now())`;
      yield* sql`
        INSERT INTO app.profiles (username, kind, github_id, gist_id, resume, fetched_at) VALUES
          ('octo', 'ghost', 1, 'g', ${json(
            resume('Octo Cat', 'Designer', ['Figma', 'React'], 'Berlin')
          )}::jsonb, now()),
          ('blank', 'ghost', 2, 'g', ${json({
            basics: { name: 'Blank' },
          })}::jsonb, now())`;
      const explore = yield* Explore;
      return yield* f(explore);
    }).pipe(
      Effect.provide(Explore.layer.pipe(Layer.provideMerge(TestDatabase)))
    )
  );

describe('Explore', () => {
  it('lists verified accounts and ghosts with something to show', async () => {
    const all = await run((e) => e.search('', 1));
    expect(all.people.map((p) => p.username).sort()).toEqual([
      'ada',
      'cy',
      'octo',
    ]);
    expect(all.popularSkills.slice(0, 2).sort()).toEqual(['Figma', 'React']);
  });

  it('finds people by every word, skills first', async () => {
    const found = await run((e) => e.search('react berlin', 1));
    expect(found.people.map((p) => p.username)).toEqual(['octo']);
    const react = await run((e) => e.search('React', 1));
    expect(react.total).toBe(2);
    expect(react.people[0]).toMatchObject({
      name: expect.any(String),
      location: expect.any(String),
      image: 'https://x.com/me.png',
    });
  });

  it('takes an account out, and back in, at once', async () => {
    const cy = '00000000-0000-0000-0000-000000000003';
    const names = await run((e) =>
      Effect.gen(function* () {
        expect(yield* e.listed(cy)).toBe(true);
        yield* e.search('', 1); // build the index first
        expect(yield* e.setListed(cy, false)).toBe(false);
        const without = (yield* e.search('figma', 1)).people;
        yield* e.setListed(cy, true);
        const back = (yield* e.search('figma', 1)).people;
        return [without, back].map((p) => p.map((x) => x.username).sort());
      })
    );
    expect(names).toEqual([['octo'], ['cy', 'octo']]);
  });
});

describe('search', () => {
  const entries = Array.from({ length: 30 }, (_, i) =>
    toEntry({
      username: `p${i}`,
      resume: resume(`Person ${i}`, 'Dev', ['Go']),
      updatedAt: new Date(2026, 0, i + 1),
    })
  ).filter((e): e is Entry => e !== undefined);

  it('pages, keeping the page in range', () => {
    const first = search(entries, [], 'go', 1);
    expect(first).toMatchObject({ total: 30, pageCount: 2, page: 1 });
    expect(first.people).toHaveLength(24);
    expect(search(entries, [], 'go', 9).page).toBe(2);
    expect(search(entries, [], 'go', Number.NaN).page).toBe(1);
    // Newest first among equals.
    expect(first.people[0]?.username).toBe('p29');
  });

  it('keeps one of many copies of a template: the owner’s', () => {
    const copy = (username: string) =>
      toEntry({
        username,
        resume: resume('Thomas Davis', 'Engineer', ['Go']),
        updatedAt: null,
      });
    const kept = dropTemplates(
      [copy('a1'), copy('b2'), copy('thomasdavis'), copy('c3')].filter(
        (e): e is Entry => e !== undefined
      )
    );
    expect(kept.map((e) => e.listing.username)).toEqual(['thomasdavis']);
    expect(dropTemplates(entries.slice(0, 2))).toHaveLength(2);
  });

  it('ignores http images and empty templates', () => {
    const entry = toEntry({
      username: 'x',
      resume: { basics: { name: 'X', label: 'Y', image: 'http://a/b.png' } },
      updatedAt: null,
    });
    expect(entry?.listing.image).toBeNull();
    expect(
      toEntry({
        username: 'y',
        resume: { basics: { name: 'Y' } },
        updatedAt: null,
      })
    ).toBeUndefined();
  });
});
