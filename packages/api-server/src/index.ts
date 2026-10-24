import { Accounts } from '@repo/accounts';
import { Health, JsonResumeApi } from '@repo/api';
import { Duration, Effect, Layer, Schedule } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { AccountHandlers } from './account';
import { AnalyticsHandlers, EventsHandlers } from './analytics';
import { AuthHandlers } from './auth';
import { AuthenticationLive } from './authentication';
import { EditorHandlers } from './editor';
import { GithubRoutes } from './github';

export { AuthenticationLive } from './authentication';
export { client } from './http';

const SystemHandlers = (version: string) =>
  HttpApiBuilder.group(JsonResumeApi, 'system', (handlers) =>
    handlers.handle('health', () =>
      Effect.succeed(new Health({ status: 'ok', version }))
    )
  );

/**
 * Every /api route: the HttpApi groups with their handlers and the session
 * middleware, plus the GitHub redirects. Needs Accounts, RateLimiter,
 * Analytics, AnalyticsStore and GithubOAuth from the app.
 */
export const apiRoutes = (version: string) =>
  Layer.mergeAll(
    HttpApiBuilder.layer(JsonResumeApi, {
      openapiPath: '/api/openapi.json',
    }).pipe(
      Layer.provide([
        SystemHandlers(version),
        AuthHandlers,
        AccountHandlers,
        AnalyticsHandlers,
        EventsHandlers,
        EditorHandlers,
      ]),
      Layer.provide(AuthenticationLive)
    ),
    GithubRoutes
  );

/** Hourly: frees the names of email accounts never verified, and of renames past their redirect. */
export const PurgeUnverified = Layer.effectDiscard(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    yield* Effect.all([accounts.purgeUnverified, accounts.purgeRetired]).pipe(
      Effect.tap(([unverified, retired]) =>
        unverified + retired > 0
          ? Effect.logInfo('Freed usernames', { unverified, retired })
          : Effect.void
      ),
      Effect.repeat(Schedule.spaced(Duration.hours(1))),
      Effect.forkScoped
    );
  })
);
