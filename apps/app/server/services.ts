import {
  Accounts,
  GistFiles,
  GithubOAuth,
  Mailer,
  RateLimiter,
} from '@repo/accounts';
import { PgAccountStore } from '@repo/accounts/sql';
import { Analytics } from '@repo/analytics';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { JobBoard, JobMatcher, OpenAiJobs } from '@repo/jobs';
import { GithubGists, Profiles, Usernames } from '@repo/profiles';
import { PgProfileStore } from '@repo/profiles/sql';
import { Layer } from 'effect';
import type { SqlClient } from 'effect/sql';

/**
 * Every service the server uses, over one database. Build it once and share
 * a MemoMap between the runtimes that use it, so there is one pool, one
 * migration run and one rate limiter.
 */
export const appServices = <E>(
  database: Layer.Layer<SqlClient.SqlClient, E>
) => {
  const stores = Layer.mergeAll(
    PgProfileStore,
    PgAccountStore,
    PgAnalyticsStore,
    JobBoard.layer,
    JobMatcher.layer.pipe(Layer.provide(OpenAiJobs))
  ).pipe(Layer.provide(database));
  const profiles = Layer.mergeAll(Profiles.layer, Usernames.layer).pipe(
    Layer.provideMerge(Layer.mergeAll(GithubGists.layer, stores))
  );
  return Layer.mergeAll(Accounts.layer, Analytics.layer).pipe(
    Layer.provideMerge(
      Layer.mergeAll(
        profiles,
        RateLimiter.layer,
        GistFiles.layer,
        Mailer.layer,
        GithubOAuth.layer
      )
    )
  );
};
