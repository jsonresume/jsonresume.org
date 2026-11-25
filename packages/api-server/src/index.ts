import { JobDigestHandlers } from './jobDigest';
import { EmailSettingsHandlers } from './emailSettings';
import { Accounts } from '@repo/accounts';
import { sendReports } from '@repo/resume-report';
import { Health, JsonResumeApi } from '@repo/api';
import { Duration, Effect, Layer, Schedule } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { AccountHandlers } from './account';
import { AnalyticsHandlers, EventsHandlers } from './analytics';
import { AuthHandlers } from './auth';
import { CareerHandlers } from './career';
import { AuthenticationLive } from './authentication';
import { EditorHandlers } from './editor';
import { ExploreHandlers, MyListingHandlers } from './explore';
import { ImportHandlers } from './import';
import { GithubRoutes } from './github';
import { JobDecisionsHandlers } from './jobDecisions';
import { CompaniesHandlers, JobsHandlers, MyJobsHandlers } from './jobs';
import { ApiKeyAuthenticationLive, KeysHandlers } from './keys';
import { OAuthConsentHandlers, OAuthHandlers } from './oauth';
import { AppsDirectoryHandlers, OAuthAppsHandlers } from './oauthApps';
import { OAuthBearerLive, OAuthResourceHandlers } from './oauthResource';
import { PathwaysRoutes } from './pathways';
import { ProposalsHandlers } from './proposals';
import { ResumeVersionsHandlers } from './resumeVersions';
import { VariantsHandlers } from './variants';
import { V1Handlers, V1PublicHandlers } from './v1';

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
 * Analytics, AnalyticsStore, GithubOAuth, ApiKeys, OAuth, JobBoard, JobMatcher,
 * Explore and Importer
 * from the app.
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
        ResumeVersionsHandlers,
        VariantsHandlers,
        ProposalsHandlers,
        AnalyticsHandlers,
        EventsHandlers,
        EditorHandlers,
        ImportHandlers,
        JobsHandlers,
        MyJobsHandlers,
        CompaniesHandlers,
        JobDecisionsHandlers,
        JobDigestHandlers,
        EmailSettingsHandlers,
        CareerHandlers,
        ExploreHandlers,
        MyListingHandlers,
        KeysHandlers,
        V1Handlers,
        V1PublicHandlers,
        OAuthHandlers,
        OAuthConsentHandlers,
        OAuthAppsHandlers,
        AppsDirectoryHandlers,
        OAuthResourceHandlers,
      ]),
      Layer.provide([
        AuthenticationLive,
        ApiKeyAuthenticationLive,
        OAuthBearerLive,
      ])
    ),
    GithubRoutes,
    PathwaysRoutes
  );

/** Every five minutes: the welcome, verify reminders and empty-page nudge that are due. */
const AccountEmails = Layer.effectDiscard(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    yield* accounts.sendAccountEmails.pipe(
      Effect.tap((sent) =>
        sent > 0 ? Effect.logInfo('Account emails sent', { sent }) : Effect.void
      ),
      Effect.catchCause((cause) =>
        Effect.logError('Account emails failed', { cause })
      ),
      Effect.repeat(Schedule.spaced(Duration.minutes(5))),
      Effect.forkScoped
    );
  })
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

/** Every 15 minutes: the monthly resume reports, early each month (@repo/resume-report). */
const ResumeReports = Layer.effectDiscard(
  sendReports.pipe(
    Effect.tap((sent) =>
      sent > 0 ? Effect.logInfo('Resume reports sent', { sent }) : Effect.void
    ),
    Effect.catchCause((cause) =>
      Effect.logError('Resume reports failed', { cause })
    ),
    Effect.repeat(Schedule.spaced(Duration.minutes(15))),
    Effect.forkScoped
  )
);

/** What the server runs in the background for accounts: purges and emails. */
export const AccountJobs = Layer.mergeAll(
  PurgeUnverified,
  AccountEmails,
  ResumeReports
);
