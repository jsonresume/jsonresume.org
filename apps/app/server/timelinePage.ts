import { resumeProblemStatus } from '@repo/domain';
import type { Profiles } from '@repo/profiles';
import { timelineOutcome } from '@repo/resume-host';
import { toTimeline } from '@repo/timeline';
import { Clock, Effect, type Layer, ManagedRuntime } from 'effect';
import type { Render } from './resumes';

/** The Hono path pattern for /@username/timeline. */
export const timelinePath = '/:handle{@[^/]+}/timeline';

/**
 * Serves /@username/timeline: the resume as a timeline, rendered by the
 * app's route with it as router context (src/routes/timeline.tsx), or the
 * page explaining why there is none.
 */
export function createTimelinePage<E>(
  render: Render,
  services: Layer.Layer<Profiles, E>,
  options: { memoMap?: Layer.MemoMap } = {}
) {
  const runtime = ManagedRuntime.make(services, options);
  const fetch = async (request: Request): Promise<Response | undefined> => {
    const [outcome, now] = await runtime.runPromise(
      Effect.all([
        timelineOutcome(new URL(request.url)),
        Clock.currentTimeMillis,
      ])
    );
    if (outcome === undefined) return undefined;
    if (outcome._tag === 'Respond') return outcome.response;
    if (outcome._tag === 'Problem') {
      const page = await render(request, { resumeProblem: outcome.problem });
      return new Response(page.body, {
        status: resumeProblemStatus(outcome.problem),
        headers: page.headers,
      });
    }
    const today = new Date(now).toISOString().slice(0, 10);
    return render(request, {
      timeline: {
        username: outcome.username,
        today,
        timeline: toTimeline(outcome.resume, outcome.username, today),
      },
    });
  };
  return { fetch, dispose: () => runtime.dispose() };
}
