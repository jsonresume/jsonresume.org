import type { ApiKeys, RateLimiter } from '@repo/accounts';
import { resumeProblemStatus } from '@repo/domain';
import { Analytics, clientFrom } from '@repo/analytics';
import type { Profiles } from '@repo/profiles';
import type { ResumePdf } from '@repo/resume-pdf';
import {
  describeProblem,
  resumeOutcome,
  type ResumeOutcome,
} from '@repo/resume-host';
import { Effect, type Layer, ManagedRuntime } from 'effect';
import { randomUUID } from 'node:crypto';
import type { RouterContext } from '../src/routes/root';
import { gateRead } from './readers';

/** The app's live renderer: a request and router context in, a page out. */
export type Render = (
  request: Request,
  context: RouterContext
) => Promise<Response>;

/** Count a .json, .yaml, .txt or .docx read; themed pages count themselves. */
const recordRead = (
  read: NonNullable<Extract<ResumeOutcome, { _tag: 'Respond' }>['read']>,
  request: Request,
  reader?: string
) =>
  Effect.gen(function* () {
    const analytics = yield* Analytics;
    yield* analytics.view(
      {
        id: randomUUID(),
        username: read.username,
        kind: read.format,
        theme: null,
        referrer: request.headers.get('referer'),
      },
      // A keyed reader is counted by its key's name (Downloaded by).
      clientFrom((name) =>
        name === 'user-agent' && reader
          ? `${reader.replace(/[\s/]+/g, '-')}/api-key`
          : request.headers.get(name)
      )
    );
  });

/** The Hono path pattern for /@username and /@username.ext. */
export const resumePath = '/:handle{@[^/]+}';

/**
 * Serves /@username: the resume (@repo/resume-host), or the reason there is
 * none, as the app's page for themed requests and as JSON for data formats.
 * Paths that aren't a username pass through (undefined).
 */
export function createResumeHandler<E>(
  render: Render,
  services: Layer.Layer<
    Profiles | Analytics | ResumePdf | ApiKeys | RateLimiter,
    E
  >,
  options: { memoMap?: Layer.MemoMap } = {}
) {
  const runtime = ManagedRuntime.make(services, options);

  const fetch = async (request: Request): Promise<Response | undefined> => {
    const gate = await runtime.runPromise(gateRead(request));
    if (gate._tag === 'Refused') return gate.response;
    const reader = gate._tag === 'Keyed' ? gate.reader : undefined;
    const outcome = await runtime.runPromise(
      resumeOutcome(new URL(request.url))
    );
    if (outcome === undefined) return undefined;
    if (outcome._tag === 'Respond') {
      if (outcome.read)
        runtime.runFork(recordRead(outcome.read, request, reader));
      return outcome.response;
    }

    const { problem } = outcome;
    const status = resumeProblemStatus(problem);
    const headers = new Headers({
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    });
    if (status === 503) headers.set('retry-after', '60');
    if (!outcome.page) {
      const error = { code: problem.kind, message: describeProblem(problem) };
      return Response.json({ error }, { status, headers });
    }
    const page = await render(request, { resumeProblem: problem });
    page.headers.forEach((value, name) => {
      if (!headers.has(name)) headers.set(name, value);
    });
    return new Response(page.body, { status, headers });
  };

  return { fetch, dispose: () => runtime.dispose() };
}
