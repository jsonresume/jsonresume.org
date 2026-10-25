import {
  Accounts,
  ApiKeys,
  GistFiles,
  OAuth,
  GithubOAuth,
  Mailer,
  RateLimiter,
} from '@repo/accounts';
import { PgAccountStore } from '@repo/accounts/sql';
import { Analytics } from '@repo/analytics';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { Explore } from '@repo/explore';
import { JobBoard, JobMatcher, OpenAiJobs } from '@repo/jobs';
import { Copilot } from '@repo/pathways';
import { GithubGists, Profiles, Usernames } from '@repo/profiles';
import { ResumePdf } from '@repo/resume-pdf';
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
    ApiKeys.layer,
    OAuth.layer,
    JobBoard.layer,
    Explore.layer,
    JobMatcher.layer.pipe(Layer.provide(OpenAiJobs))
  ).pipe(Layer.provide(database));
  const profiles = Layer.mergeAll(Profiles.layer, Usernames.layer).pipe(
    Layer.provideMerge(Layer.mergeAll(GithubGists.layer, stores))
  );
  const accounts = Layer.mergeAll(Accounts.layer, Analytics.layer).pipe(
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
  // Pathways' copilot uses every MCP tool, so everything above.
  return Layer.mergeAll(Copilot.layer, ResumePdf.layer).pipe(
    Layer.provideMerge(accounts)
  );
};
