import { contributors } from '@repo/contributors';
import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

interface Listed {
  collected: string;
  total: number;
  people: ReadonlyArray<{
    name: string;
    github?: string;
    profile?: string;
    credits: ReadonlyArray<{ credit: string; url: string }>;
  }>;
}

describe('community tools', () => {
  it('lists contributors with every credit linked, and filters them', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    const all: Listed = (await call('list_contributors', { limit: 3 })).value;
    expect(all.total).toBe(contributors.people.length);
    expect(all.people).toHaveLength(3);
    for (const person of all.people) {
      expect(person.credits.length).toBeGreaterThan(0);
      for (const c of person.credits) expect(c.url).toMatch(/^https:\/\//);
    }
    const team: Listed = (
      await call('list_contributors', { did: 'team', limit: null })
    ).value;
    expect(team.people.length).toBeGreaterThan(0);
    expect(
      team.people.every((p) =>
        p.credits.some((c) => c.url === 'https://jsonresume.org/team')
      )
    ).toBe(true);
    const none: Listed = (
      await call('list_contributors', { query: 'zz-nobody-zz' })
    ).value;
    expect(none).toMatchObject({ total: 0, people: [] });
  });
});
