import { resumeProblemStatus } from '@repo/domain';
import { GithubGists, Profiles, type ProfileStore } from '@repo/profiles';
import { describeProblem, resumeOutcome } from '@repo/resume-host';
import { Layer, ManagedRuntime } from 'effect';
import type { RouterContext } from '../src/routes/root';

/** The app's live renderer: a request and router context in, a page out. */
export type Render = (
  request: Request,
  context: RouterContext
) => Promise<Response>;

/** Profiles read from GitHub, kept in `store`. */
export const liveProfiles = <E>(store: Layer.Layer<ProfileStore, E>) =>
  Profiles.layer.pipe(Layer.provide(Layer.mergeAll(GithubGists.layer, store)));

/** The Hono path pattern for /@username and /@username.ext. */
export const resumePath = '/:handle{@[^/]+}';

/**
 * Serves /@username: the resume (@repo/resume-host), or the reason there is
 * none, as the app's page for themed requests and as JSON for data formats.
 * Paths that aren't a username pass through (undefined).
 */
export function createResumeHandler<E>(
  render: Render,
  profiles: Layer.Layer<Profiles, E>
) {
  const runtime = ManagedRuntime.make(profiles);

  const fetch = async (request: Request): Promise<Response | undefined> => {
    const outcome = await runtime.runPromise(
      resumeOutcome(new URL(request.url))
    );
    if (outcome === undefined) return undefined;
    if (outcome._tag === 'Respond') return outcome.response;

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
