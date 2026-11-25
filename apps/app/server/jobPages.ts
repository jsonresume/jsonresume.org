import { JobBoard } from '@repo/jobs';
import { Effect, type Layer, ManagedRuntime } from 'effect';
import type { Render } from './resumes';

/** Hono path patterns for the board and a job. */
export const jobsPath = '/jobs';
export const jobPath = '/jobs/:id{[0-9]+}';
export const companyPath = '/jobs/companies/:slug{[a-z0-9-]+}';

/**
 * Serves /jobs, /jobs/:id and /jobs/companies/:slug: reads the board, the
 * job or the company, then renders the app's route with it as router
 * context (see src/routes/jobs.tsx).
 */
export function createJobPages<E>(
  render: Render,
  services: Layer.Layer<JobBoard, E>,
  options: { memoMap?: Layer.MemoMap } = {}
) {
  const runtime = ManagedRuntime.make(services, options);
  const read = <A, E2>(
    f: (board: JobBoard['Service']) => Effect.Effect<A, E2>
  ) =>
    runtime.runPromise(
      Effect.gen(function* () {
        return yield* f(yield* JobBoard);
      })
    );

  const board = async (request: Request) =>
    render(request, {
      jobBoard: await read((b) => b.board),
    });

  const job = async (request: Request) => {
    const id = Number(new URL(request.url).pathname.split('/')[2]);
    const found = await read((b) =>
      b.job(id).pipe(Effect.orElseSucceed(() => null))
    );
    const page = await render(request, { job: found });
    return found
      ? page
      : new Response(page.body, { status: 404, headers: page.headers });
  };

  const company = async (request: Request) => {
    const slug = new URL(request.url).pathname.split('/')[3] ?? '';
    const found = await read((b) =>
      b.company(slug).pipe(Effect.orElseSucceed(() => null))
    );
    const page = await render(request, { company: found });
    return found
      ? page
      : new Response(page.body, { status: 404, headers: page.headers });
  };

  return { board, job, company, dispose: () => runtime.dispose() };
}

/** /api-keys: where the jobs CLI and its docs send people for a key. */
export const apiKeysRoute = {
  path: '/api-keys',
  fetch: async () =>
    new Response(null, {
      status: 301,
      headers: { location: '/dashboard/settings#api-keys' },
    }),
};
