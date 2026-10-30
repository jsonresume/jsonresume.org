import { HttpApi, OpenApi } from 'effect/http-api';
import { AccountApi } from './AccountApi';
import { AnalyticsApi } from './AnalyticsApi';
import { AuthApi } from './AuthApi';
import { EditorApi } from './EditorApi';
import { EventsApi } from './EventsApi';
import { ExploreApi, MyListingApi } from './ExploreApi';
import { KeysApi } from './KeysApi';
import { OAuthApi, OAuthConsentApi } from './OAuthApi';
import { OAuthAppsApi } from './OAuthAppsApi';
import { OAuthResourceApi } from './OAuthResourceApi';
import { JobsApi, MyJobsApi } from './JobsApi';
export { CareerTree, CareerTreeNode } from './CareerTree';
import { SystemApi } from './SystemApi';
import { V1Api, V1PublicApi } from './V1Api';

export { Account, AccountApi, ResumeSource } from './AccountApi';
export {
  AnalyticsApi,
  AnalyticsRange,
  Breakdown,
  Overview,
  RecentView,
  Totals,
} from './AnalyticsApi';
export {
  AuthApi,
  Email,
  Password,
  PendingGithub,
  UsernameCheck,
} from './AuthApi';
export {
  Authentication,
  CurrentUser,
  SessionUser,
  sessionCookie,
  SIGNED_IN_HINT,
} from './Authentication';
export * from './errors';
export { EditorApi, EditorResume } from './EditorApi';
export { EventsApi, PingEvent, ViewEvent } from './EventsApi';
export {
  ExploreApi,
  ExploreListing,
  ExploreResults,
  MyListingApi,
  ResumeListing,
} from './ExploreApi';
export { ApiKey, KeysApi, TooManyKeys } from './KeysApi';
export {
  Connection,
  ConsentClient,
  OAuthApi,
  OAuthConsentApi,
  OAuthError,
} from './OAuthApi';
export { OAuthApp, OAuthAppInput, OAuthAppsApi } from './OAuthAppsApi';
export {
  CurrentGrant,
  InsufficientScope,
  InvalidToken,
  OAuthBearer,
  OAuthResourceApi,
  ResumeNotSaved,
  UserInfo,
} from './OAuthResourceApi';
export { Health, SystemApi } from './SystemApi';
export { allows, parseScope, SCOPE_NAMES, SCOPES, type Scope } from './scopes';
export {
  ApiKeyAuthentication,
  V1Api,
  V1BadRequest,
  V1Job,
  V1NotFound,
  V1NotYet,
  V1PublicApi,
  V1TooMany,
  V1Unauthorized,
} from './V1Api';
export {
  Direction,
  EmploymentType,
  Job,
  JobBoard,
  JobMark,
  JobMatch,
  JobsApi,
  JobsStatus,
  JobSummary,
  MyJobsApi,
  RemoteScope,
  Seniority,
} from './JobsApi';

/**
 * The jsonresume.org API. Every endpoint lives under /api. Groups are added
 * here as features move into the new app; the server implements them and
 * clients (HttpApiClient, AtomHttpApi) are derived from this definition.
 */
export class JsonResumeApi extends HttpApi.make('jsonresume')
  .add(SystemApi)
  .add(AuthApi)
  .add(AccountApi)
  .add(KeysApi)
  .add(AnalyticsApi)
  .add(EventsApi)
  .add(EditorApi)
  .add(JobsApi)
  .add(MyJobsApi)
  .add(ExploreApi)
  .add(MyListingApi)
  .add(V1Api)
  .add(V1PublicApi)
  .add(OAuthApi)
  .add(OAuthConsentApi)
  .add(OAuthAppsApi)
  .add(OAuthResourceApi)
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'JSON Resume API' })) {}
export { CopilotEvent, CopilotMessage, CopilotRequest } from './PathwaysApi';
