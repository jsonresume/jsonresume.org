import {
  Accounts,
  ApiKeys,
  GistFiles,
  OAuth,
  GithubOAuth,
  Mailer,
  RateLimiter,
  ResumeSaved,
} from '@repo/accounts';
import { PgAccountStore } from '@repo/accounts/sql';
import { Analytics } from '@repo/analytics';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { CareerGraphs, CareersLive } from '@repo/careers';
import { Explore } from '@repo/explore';
import { JobBoard, JobMatcher, OpenAiJobs } from '@repo/jobs';
import { Copilot } from '@repo/pathways';
import { GithubGists, Profiles, Usernames } from '@repo/profiles';
import { Downloader, ImporterLive } from '@repo/resume-import';
import { ResumePdf } from '@repo/resume-pdf';
import { ResumeVersions } from '@repo/resume-versions';
import { PgProfileStore } from '@repo/profiles/sql';
import { Effect, Layer } from 'effect';
import type { SqlClient } from 'effect/sql';
import { ProductEvents } from '@repo/posthog';

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
    ResumeVersions.layer,
    JobBoard.layer,
    Explore.layer,
    JobMatcher.layer.pipe(Layer.provide(OpenAiJobs))
  ).pipe(Layer.provide(database));
  const profiles = Layer.mergeAll(Profiles.layer, Usernames.layer).pipe(
    Layer.provideMerge(Layer.mergeAll(GithubGists.layer, stores))
  );
  // The career graph: on the matcher, with OpenAI's embeddings for skills.
  const careers = CareersLive.pipe(
    Layer.provide(Layer.mergeAll(stores, OpenAiJobs, database))
  );
  // A saved resume starts the career graph's model work once saves settle.
  const prepareOnSave = Layer.effect(
    ResumeSaved,
    Effect.gen(function* () {
      const graphs = yield* CareerGraphs;
      return ResumeSaved.of({
        saved: (userId, resume) => graphs.prepare(userId, resume, 'saved'),
      });
    })
  ).pipe(Layer.provide(careers));
  const accounts = Layer.mergeAll(Accounts.layer, Analytics.layer).pipe(
    Layer.provideMerge(
      Layer.mergeAll(
        profiles,
        RateLimiter.layer,
        GistFiles.layer,
        Mailer.layer,
        GithubOAuth.layer,
        prepareOnSave,
        // Accounts' own queries (privacy) use the database directly.
        database
      )
    )
  );
  // Resume imports (POST /api/import, MCP import_resume), with their events.
  const imports = Layer.merge(
    ImporterLive.pipe(
      Layer.provide(Layer.merge(database, ProductEvents.layer))
    ),
    Downloader.layer
  );
  // Pathways' copilot uses every MCP tool, so everything above.
  return Layer.mergeAll(
    Copilot.layer,
    ResumePdf.layer,
    ProductEvents.layer,
    imports
  ).pipe(Layer.provideMerge(Layer.merge(accounts, careers)));
};
