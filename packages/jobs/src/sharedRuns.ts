import { Deferred, Effect, Option, type Duration } from 'effect';

export interface RunOptions {
  /** How long to wait for the run; it may go on after. */
  wait: Duration.Input;
  /**
   * A run this call starts is a child of the calling fiber, stopped if that
   * fiber is interrupted (a superseded prepare). Wait for it to finish.
   * Otherwise it is detached and outlives everyone waiting on it.
   */
  owned?: boolean;
}

/** How a wait on a run ended. */
export type RunState = 'done' | 'running' | 'stopped';

/**
 * Model work run once per key (a content hash) at a time and shared:
 * whoever asks while it runs waits on that run instead of starting another.
 */
export const sharedRuns = () => {
  // Each running key's outcome: true when it finished, false when stopped.
  const running = new Map<string, Deferred.Deferred<boolean>>();

  /** Runs `work` for `key` unless it is already running, and waits up to `wait`. */
  const run = <R>(
    key: string,
    work: Effect.Effect<void, never, R>,
    options: RunOptions
  ) =>
    Effect.gen(function* () {
      let outcome = running.get(key);
      if (!outcome) {
        const mine = Deferred.makeUnsafe<boolean>();
        running.set(key, mine);
        outcome = mine;
        const tracked = work.pipe(
          Effect.onExit((exit) =>
            Effect.sync(() => {
              if (running.get(key) === mine) running.delete(key);
            }).pipe(
              Effect.andThen(Deferred.succeed(mine, exit._tag === 'Success'))
            )
          )
        );
        yield* options.owned
          ? Effect.forkChild(tracked)
          : Effect.forkDetach(tracked);
      }
      const ended = yield* Deferred.await(outcome).pipe(
        Effect.timeoutOption(options.wait)
      );
      return Option.match(ended, {
        onNone: (): RunState => 'running',
        onSome: (finished): RunState => (finished ? 'done' : 'stopped'),
      });
    });

  return { run };
};
