import { Explore } from '@repo/explore';
import { Effect, type Layer, ManagedRuntime } from 'effect';
import type { Render } from './resumes';

/** The Hono path pattern for Explore. */
export const explorePath = '/explore';

/**
 * Serves /explore: searches for ?q= on ?page=, then renders the app's route
 * with the results as router context (see src/routes/explore.tsx).
 */
export function createExplorePage<E>(
  render: Render,
  services: Layer.Layer<Explore, E>,
  options: { memoMap?: Layer.MemoMap } = {}
) {
  const runtime = ManagedRuntime.make(services, options);
  const fetch = async (request: Request) => {
    const url = new URL(request.url);
    const results = await runtime.runPromise(
      Effect.flatMap(Explore, (explore) =>
        explore.search(
          url.searchParams.get('q') ?? '',
          Number(url.searchParams.get('page') ?? 1)
        )
      )
    );
    return render(request, { explore: results });
  };
  return { fetch, dispose: () => runtime.dispose() };
}
