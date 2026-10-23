import {
  ProfileNotFound,
  Profiles,
  GithubUnavailable,
  type Username,
} from '@repo/profiles';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { resumeOutcome, type ResumeOutcome } from './host';
import { describeProblem } from './problems';

const resumes: Record<string, unknown> = {
  foo: { basics: { name: 'Foo Bar' }, meta: { theme: 'even' } },
  plain: { basics: { name: 'Plain' } },
  list: [1, 2],
};

const profiles = Layer.succeed(
  Profiles,
  Profiles.of({
    resume: (username: Username, options) => {
      if (username === 'down')
        return Effect.fail(new GithubUnavailable({ message: 'x' }));
      if (username === 'merged')
        return Effect.succeed({ _tag: 'Moved', username: 'mine' });
      if (options?.file === 'cv.json')
        return Effect.succeed({
          username,
          resume: { basics: { name: 'CV' } },
          source: 'gist',
          _tag: 'Resume',
          stale: false,
        });
      const resume = resumes[username];
      return resume === undefined
        ? Effect.fail(
            new ProfileNotFound({
              username,
              reason: 'no-gist',
              file: options?.file ?? 'resume.json',
            })
          )
        : Effect.succeed({
            username,
            resume,
            source: 'ghost',
            stale: false,
            _tag: 'Resume',
          });
    },
  })
);

const get = (path: string) =>
  Effect.runPromise(
    resumeOutcome(new URL(path, 'https://jsonresume.org')).pipe(
      Effect.provide(profiles)
    )
  );

const response = (outcome: ResumeOutcome | undefined) => {
  if (outcome?._tag !== 'Respond')
    throw new Error(`expected a response, got ${JSON.stringify(outcome)}`);
  return outcome.response;
};

describe('resumeOutcome', () => {
  it('leaves other paths alone', async () => {
    expect(await get('/schema')).toBeUndefined();
    expect(await get('/@not_a_name')).toBeUndefined();
  });

  it('renders the theme named in meta.theme', async () => {
    const res = response(await get('/@foo'));
    expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(res.headers.get('cache-control')).toBe('no-store');
    const html = await res.text();
    expect(html).toContain('Foo Bar');
    expect(html).toContain('/api/events/view');
  });

  it('lets ?theme= override, and falls back to elegant', async () => {
    const themed = await response(await get('/@foo?theme=flat')).text();
    const plain = await response(await get('/@plain')).text();
    expect(themed).not.toBe(await response(await get('/@foo')).text());
    expect(plain).toContain('Plain');
  });

  it('serves data formats with CORS', async () => {
    const outcome = await get('/@foo.json');
    expect(outcome?._tag === 'Respond' && outcome.read).toEqual({
      username: 'foo',
      format: 'json',
    });
    const res = response(outcome);
    expect(await res.json()).toEqual(resumes['foo']);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(await response(await get('/@foo.txt')).text()).toMatch(/^Foo Bar\n/);
    expect(await response(await get('/@foo.yaml')).text()).toContain(
      'name: Foo Bar'
    );
  });

  it('reads another gist file with ?gistname=', async () => {
    expect(
      await response(await get('/@foo.json?gistname=cv.json')).json()
    ).toEqual({ basics: { name: 'CV' } });
  });

  it('redirects capitals to the lowercase path, keeping the query', async () => {
    const res = response(await get('/@Foo.JSON?theme=x'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('/@foo.json?theme=x');
  });

  it('redirects a merged name to its account, keeping format and query', async () => {
    const res = response(await get('/@merged.json?x=1'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('/@mine.json?x=1');
  });

  it('redirects ?theme=random to a real theme', async () => {
    const res = response(await get('/@foo?theme=random'));
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toMatch(/^\/@foo\?theme=[a-z-]+$/);
  });

  it.each([
    ['/@nobody', { kind: 'no-gist', page: true }],
    ['/@nobody.json', { kind: 'no-gist', page: false }],
    ['/@down', { kind: 'github-down', page: true }],
    ['/@list.json', { kind: 'not-object', page: false }],
    ['/@foo?theme=nope', { kind: 'theme-missing', page: true }],
    ['/@foo.pdf', { kind: 'unknown-format', page: true }],
  ])('explains %s', async (path, expected) => {
    const outcome = await get(path);
    if (outcome?._tag !== 'Problem') throw new Error('expected a problem');
    expect({ kind: outcome.problem.kind, page: outcome.page }).toEqual(
      expected
    );
    expect(describeProblem(outcome.problem)).toMatch(/\.$/);
  });
});
