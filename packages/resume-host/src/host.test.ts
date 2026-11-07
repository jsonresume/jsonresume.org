import {
  ProfileNotFound,
  Profiles,
  GithubUnavailable,
  type Username,
} from '@repo/profiles';
import { unzip } from '@repo/resume-formats/testing';
import { PdfFailed, ResumePdf } from '@repo/resume-pdf';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { resumeOutcome } from './host';
import type { ResumeOutcome } from './outcome';
import { describeProblem } from './problems';

const resumes: Record<string, unknown> = {
  foo: { basics: { name: 'Foo Bar' }, meta: { theme: 'even' } },
  plain: { basics: { name: 'Plain' } },
  yank: { basics: { name: 'Yank', location: { countryCode: 'US' } } },
  broken: { basics: { name: 'Broken' } },
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
      // Ada has one variant, "acme".
      if (options?.variant !== undefined)
        return options.variant === 'acme' && username === 'ada'
          ? Effect.succeed({
              username,
              resume: { basics: { name: 'Ada for Acme' } },
              source: 'account',
              stale: false,
              _tag: 'Resume',
            })
          : Effect.fail(
              new ProfileNotFound({
                username,
                reason: 'no-variant',
                file: options.variant,
              })
            );
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

/**
 * Prints the page's HTML as the "PDF", with the paper and whether it was
 * fitted, so tests can read them.
 */
const printer = Layer.succeed(
  ResumePdf,
  ResumePdf.of({
    print: (html, paper, options) =>
      html.includes('Broken')
        ? Effect.fail(new PdfFailed({ message: 'x' }))
        : Effect.succeed(
            new TextEncoder().encode(
              `${paper}${options?.fit ? ':fit' : ''}:${html}`
            )
          ),
  })
);

const get = (path: string) =>
  Effect.runPromise(
    resumeOutcome(new URL(path, 'https://jsonresume.org')).pipe(
      Effect.provide(Layer.merge(profiles, printer))
    )
  );

const response = (outcome: ResumeOutcome | undefined) => {
  if (outcome?._tag !== 'Respond')
    throw new Error(`expected a response, got ${JSON.stringify(outcome)}`);
  return outcome.response;
};

describe('resumeOutcome', () => {
  it('serves a variant at /@name/slug, in every format, and leaves timeline be', async () => {
    const json = await response(await get('/@ada/acme.json')).json();
    expect(json).toEqual({ basics: { name: 'Ada for Acme' } });
    const page = await response(await get('/@ada/acme')).text();
    expect(page).toContain('Ada for Acme');
    expect(await get('/@ada/timeline')).toBeUndefined();
    expect(await get('/@ada/nope.json')).toMatchObject({
      _tag: 'Problem',
      problem: { kind: 'no-variant', file: 'nope' },
    });
    const moved = response(await get('/@merged/acme.pdf'));
    expect(moved.status).toBe(301);
    expect(moved.headers.get('location')).toBe('/@mine/acme.pdf');
  });

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

  it('serves RenderCV, uncounted', async () => {
    const outcome = await get('/@foo.rendercv');
    expect(outcome?._tag === 'Respond' && outcome.read).toBeUndefined();
    expect(await response(outcome).text()).toContain('name: Foo Bar');
  });

  it('serves a Word document to download, counted', async () => {
    const outcome = await get('/@foo.docx');
    expect(outcome?._tag === 'Respond' && outcome.read).toEqual({
      username: 'foo',
      format: 'docx',
    });
    const res = response(outcome);
    expect(res.headers.get('content-type')).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    expect(res.headers.get('content-disposition')).toBe(
      'attachment; filename="foo.docx"'
    );
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    // A zip, as every .docx is.
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect([...bytes.slice(0, 2)]).toEqual([0x50, 0x4b]);
  });

  it('sets the Word document on the paper the PDF would use', async () => {
    const size = async (path: string) => {
      const body = await response(await get(path)).arrayBuffer();
      const files = unzip(new Uint8Array(body));
      return /<w:pgSz w:w="(\d+)"/.exec(
        files.get('word/document.xml') ?? ''
      )?.[1];
    };
    expect(await size('/@foo.docx')).toBe('11906');
    expect(await size('/@foo.docx?paper=letter')).toBe('12240');
    expect(await size('/@yank.docx')).toBe('12240');
  });

  it('prints the themed page to PDF, on the paper asked for or local', async () => {
    const res = response(await get('/@foo.pdf'));
    expect(res.headers.get('content-type')).toBe('application/pdf');
    expect(res.headers.get('content-disposition')).toBe(
      'inline; filename="foo.pdf"'
    );
    const body = await res.text();
    expect(body).toMatch(/^a4:/);
    expect(body).toContain('Foo Bar');
    // The print is not a page view.
    expect(body).not.toContain('/api/events/view');
    expect(await response(await get('/@yank.pdf')).text()).toMatch(/^letter:/);
    expect(await response(await get('/@foo.pdf?paper=letter')).text()).toMatch(
      /^letter:/
    );
  });

  it('fits the print to one page with ?fit=1', async () => {
    expect(await response(await get('/@foo.pdf?fit=1')).text()).toMatch(
      /^a4:fit:/
    );
    expect(
      await response(await get('/@foo.pdf?fit=true&paper=letter')).text()
    ).toMatch(/^letter:fit:/);
    expect(await response(await get('/@foo.pdf?fit=0')).text()).toMatch(
      /^a4:</
    );
  });

  it('explains a failed print on a page', async () => {
    const outcome = await get('/@broken.pdf');
    expect(outcome).toMatchObject({
      _tag: 'Problem',
      page: true,
      problem: { kind: 'pdf-failed', username: 'broken', theme: 'elegant' },
    });
  });

  it('draws a QR code to the page', async () => {
    const res = response(await get('/@foo.qr'));
    expect(res.headers.get('content-type')).toBe('image/png');
    expect(new Uint8Array(await res.arrayBuffer()).length).toBeGreaterThan(100);
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
    ['/@foo.odt', { kind: 'unknown-format', page: true }],
    ['/@nobody.docx', { kind: 'no-gist', page: true }],
    ['/@nobody.pdf', { kind: 'no-gist', page: true }],
    ['/@broken.pdf', { kind: 'pdf-failed', page: true }],
  ])('explains %s', async (path, expected) => {
    const outcome = await get(path);
    if (outcome?._tag !== 'Problem') throw new Error('expected a problem');
    expect({ kind: outcome.problem.kind, page: outcome.page }).toEqual(
      expected
    );
    expect(describeProblem(outcome.problem)).toMatch(/\.$/);
  });
});
