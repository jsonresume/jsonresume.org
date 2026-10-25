import { JobBoard } from '@repo/jobs';
import { Effect, type Layer, ManagedRuntime } from 'effect';
import type { Render } from './resumes';

/** Hono path patterns for the board and a job. */
export const jobsPath = '/jobs';
export const jobPath = '/jobs/:id{[0-9]+}';

/**
 * Serves /jobs and /jobs/:id: reads the board or the job, then renders the
 * app's route with it as router context (see src/routes/jobs.tsx).
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

  return { board, job, dispose: () => runtime.dispose() };
}
