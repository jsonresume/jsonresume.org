// @vitest-environment node
import { Analytics } from '@repo/analytics';
import { GithubUnavailable, ProfileNotFound, Profiles } from '@repo/profiles';
import { ResumePdf } from '@repo/resume-pdf';
import { Effect, Layer } from 'effect';
import { afterAll, describe, expect, it } from 'vitest';
import { createResumeHandler } from '../server/resumes';
import { createAppRenderer, paths } from './entry-server';

const render = createAppRenderer({ routes: {} });
const request = (path: string) => new Request(`https://jsonresume.org${path}`);

describe('/@username page', () => {
  it('is never prerendered', () => {
    expect(paths.some((path) => path.includes('@'))).toBe(false);
  });

  it('explains a problem passed by the server, and stays out of search', async () => {
    const response = await render(request('/@octocat'), {
      resumeProblem: {
        kind: 'no-gist',
        username: 'octocat',
        file: 'resume.json',
      },
    });
    const html = await response.text();
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain('@octocat hasn’t published a resume');
    expect(html).toContain('<title>@octocat · JSON Resume</title>');
    expect(html).toContain('name="robots" content="noindex"');
  });

  it('reloads the whole document when reached without one', async () => {
    const response = await render(request('/@octocat'));
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
  });
});

describe('the server handler', () => {
  const reads: string[] = [];
  const analytics = Layer.succeed(
    Analytics,
    Analytics.of({
      view: (input) =>
        Effect.sync(() => void reads.push(`${input.username}.${input.kind}`)),
      ping: () => Effect.void,
    })
  );
  const resumes = createResumeHandler(
    render,
    Layer.mergeAll(
      analytics,
      Layer.succeed(
        ResumePdf,
        ResumePdf.of({ print: () => Effect.succeed(new Uint8Array()) })
      ),
      Layer.succeed(
        Profiles,
        Profiles.of({
          resume: (username) =>
            username === 'down'
              ? Effect.fail(new GithubUnavailable({ message: 'down' }))
              : Effect.fail(
                  new ProfileNotFound({
                    username,
                    reason: 'no-gist',
                    file: 'resume.json',
                  })
                ),
        })
      )
    )
  );
  afterAll(() => resumes.dispose());

  it('passes other paths on', async () => {
    expect(await resumes.fetch(request('/schema'))).toBeUndefined();
  });

  it('explains a page problem with the app page', async () => {
    const response = await resumes.fetch(request('/@octocat'));
    expect(response?.status).toBe(404);
    expect(response?.headers.get('cache-control')).toBe('no-store');
    expect(await response?.text()).toContain('Publish your resume');
  });

  it('explains a data format problem as JSON', async () => {
    const response = await resumes.fetch(request('/@octocat.json'));
    expect(response?.status).toBe(404);
    expect(await response?.json()).toEqual({
      error: {
        code: 'no-gist',
        message: 'octocat has no public gist with a file called resume.json.',
      },
    });
  });

  it('asks clients to retry when GitHub is down', async () => {
    const response = await resumes.fetch(request('/@down.json'));
    expect(response?.status).toBe(503);
    expect(response?.headers.get('retry-after')).toBe('60');
  });
});
