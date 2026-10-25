import { HttpApi, OpenApi } from 'effect/http-api';
import { AccountApi } from './AccountApi';
import { AnalyticsApi } from './AnalyticsApi';
import { AuthApi } from './AuthApi';
import { EditorApi } from './EditorApi';
import { EventsApi } from './EventsApi';
import { KeysApi } from './KeysApi';
import { OAuthApi, OAuthConsentApi } from './OAuthApi';
import { JobsApi, MyJobsApi } from './JobsApi';
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
export { ApiKey, KeysApi, TooManyKeys } from './KeysApi';
export { Connection, OAuthApi, OAuthConsentApi, OAuthError } from './OAuthApi';
export { Health, SystemApi } from './SystemApi';
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
  .add(V1Api)
  .add(V1PublicApi)
  .add(OAuthApi)
  .add(OAuthConsentApi)
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'JSON Resume API' })) {}
export { CopilotEvent, CopilotMessage, CopilotRequest } from './PathwaysApi';
