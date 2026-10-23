import type { ResumeProblem } from '@repo/domain';
import { parseHandle, Profiles, type ResolvedResume } from '@repo/profiles';
import { formatResume } from '@repo/resume-formats';
import {
  DEFAULT_THEME,
  renderTheme,
  ResumeDocument,
  themeSlugs,
} from '@repo/resume-themes';
import { Effect, Random, Schema } from 'effect';

/** What a /@username request comes to: a response, or a problem to explain. */
export type ResumeOutcome =
  | { _tag: 'Respond'; response: Response }
  | { _tag: 'Problem'; problem: ResumeProblem; page: boolean };

/** Resumes change whenever their gist does; never let a cache keep one. */
const headers = (contentType: string) => ({
  'content-type': contentType,
  'cache-control': 'no-store',
  'access-control-allow-origin': '*',
});

const respond = (response: Response): ResumeOutcome => ({
  _tag: 'Respond',
  response,
});
const problem = (p: ResumeProblem, page: boolean): ResumeOutcome => ({
  _tag: 'Problem',
  problem: p,
  page,
});
const redirect = (location: string, status: number) =>
  respond(
    new Response(null, {
      status,
      headers: { location, 'cache-control': 'no-store' },
    })
  );

const decodeDocument = Schema.decodeUnknownOption(ResumeDocument);
const decodeMeta = Schema.decodeUnknownOption(
  Schema.Struct({ meta: Schema.Struct({ theme: Schema.String }) })
);
const metaTheme = (doc: ResumeDocument) => {
  const meta = decodeMeta(doc);
  return meta._tag === 'Some' ? meta.value.meta.theme : undefined;
};

/**
 * Serve `/@name` (a themed page) or `/@name.json|yaml|txt`. Undefined when
 * the path is not a handle, so the caller serves it as any other page.
 * Theme: ?theme=, then the resume's meta.theme, then elegant; ?theme=random
 * redirects to a random one. Other gist files with ?gistname=.
 */
export const resumeOutcome = Effect.fn('resumeOutcome')(function* (url: URL) {
  const handle = parseHandle(url.pathname.slice(1).replace(/^%40/i, '@'));
  if (!handle) return undefined;
  const { username, format } = handle;
  if (!handle.canonical)
    return redirect(url.pathname.toLowerCase() + url.search, 301);
  const page = format === 'html' || format === undefined;
  if (!format)
    return problem(
      { kind: 'unknown-format', username, extension: handle.extension },
      page
    );

  const query = url.searchParams.get('theme')?.toLowerCase();
  if (page && query === 'random') {
    const next = new URL(url);
    next.searchParams.set(
      'theme',
      yield* Random.choice(themeSlugs).pipe(
        Effect.orElseSucceed(() => DEFAULT_THEME)
      )
    );
    return redirect(next.pathname + next.search, 302);
  }

  const file = url.searchParams.get('gistname') ?? undefined;
  const resolved: ResolvedResume | ResumeOutcome = yield* (yield* Profiles)
    .resume(username, file === undefined ? {} : { file })
    .pipe(
      Effect.catchTags({
        ProfileNotFound: (e) =>
          Effect.succeed(
            problem({ kind: e.reason, username, file: e.file }, page)
          ),
        ResumeNotJson: (e) =>
          Effect.succeed(
            problem(
              { kind: 'not-json', username, file: e.file, message: e.message },
              page
            )
          ),
        GithubUnavailable: () =>
          Effect.succeed(problem({ kind: 'github-down', username }, page)),
      })
    );
  if ('_tag' in resolved) return resolved;

  const doc = decodeDocument(resolved.resume);
  if (doc._tag === 'None' || Array.isArray(resolved.resume)) {
    const message = 'expected an object';
    return problem(
      { kind: 'not-object', username, file: file ?? 'resume.json', message },
      page
    );
  }
  if (format !== 'html') {
    const { body, contentType } = formatResume(format, doc.value);
    return respond(new Response(body, { headers: headers(contentType) }));
  }

  const theme = query ?? metaTheme(doc.value)?.toLowerCase() ?? DEFAULT_THEME;
  return yield* renderTheme(theme, doc.value).pipe(
    Effect.map((html) =>
      respond(
        new Response(html, { headers: headers('text/html; charset=utf-8') })
      )
    ),
    Effect.catchTags({
      ThemeNotFound: () =>
        Effect.succeed(
          problem({ kind: 'theme-missing', username, theme }, true)
        ),
      ThemeFailed: (e) =>
        Effect.as(
          Effect.logWarning('theme failed', {
            theme,
            username,
            message: e.message,
          }),
          problem({ kind: 'theme-failed', username, theme }, true)
        ),
    })
  );
});
