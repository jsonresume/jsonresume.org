import { handlePath, parseHandle } from '@repo/profiles';
import { formatResume } from '@repo/resume-formats';
import {
  DEFAULT_THEME,
  renderTheme,
  ResumeDocument,
  themeSlugs,
} from '@repo/resume-themes';
import { withTracking } from '@repo/analytics';
import { Effect, Random, Schema } from 'effect';
import { headers, lookup, problem, redirect, respond } from './outcome';
import { pdfResponse, qrResponse } from './print';

const decodeDocument = Schema.decodeUnknownOption(ResumeDocument);
const decodeMeta = Schema.decodeUnknownOption(
  Schema.Struct({ meta: Schema.Struct({ theme: Schema.String }) })
);
const metaTheme = (doc: ResumeDocument) => {
  const meta = decodeMeta(doc);
  return meta._tag === 'Some' ? meta.value.meta.theme : undefined;
};

/**
 * Serve `/@name` (a themed page), `/@name.pdf` (that page printed), `/@name.qr`
 * (a QR code to it) or `/@name.json|yaml|txt|rendercv`. Undefined when
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
  // A person follows these links; programs read the other formats.
  const page = format === 'html' || format === 'pdf' || format === undefined;
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
  const resolved = yield* lookup(username, file, page);
  if (resolved._tag === 'Moved') {
    return redirect(handlePath(resolved.username, format) + url.search, 301);
  }
  if (resolved._tag !== 'Resume') return resolved;

  const doc = decodeDocument(resolved.resume);
  if (doc._tag === 'None' || Array.isArray(resolved.resume)) {
    const message = 'expected an object';
    return problem(
      { kind: 'not-object', username, file: file ?? 'resume.json', message },
      page
    );
  }
  if (format === 'qr') return respond(yield* qrResponse(username));
  if (format !== 'html' && format !== 'pdf') {
    const { body, contentType } = formatResume(format, doc.value);
    return respond(
      new Response(body, { headers: headers(contentType) }),
      // Analytics counts the formats people read; RenderCV is for a tool.
      format === 'rendercv' ? undefined : { username, format }
    );
  }

  const theme = query ?? metaTheme(doc.value)?.toLowerCase() ?? DEFAULT_THEME;
  return yield* renderTheme(theme, doc.value).pipe(
    Effect.flatMap((html) =>
      format === 'pdf'
        ? pdfResponse(html, username, doc.value, url.searchParams.get('paper'))
        : Effect.succeed(
            // Every themed page reports its views (see @repo/analytics).
            new Response(withTracking(html, username, theme), {
              headers: headers('text/html; charset=utf-8'),
            })
          )
    ),
    Effect.map((response) => respond(response)),
    Effect.catchTags({
      PdfFailed: (e) =>
        Effect.as(
          Effect.logWarning('pdf failed', {
            theme,
            username,
            message: e.message,
          }),
          problem({ kind: 'pdf-failed', username, theme }, true)
        ),
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
