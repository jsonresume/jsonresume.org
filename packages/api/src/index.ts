import { HttpApi, OpenApi } from 'effect/http-api';
import { AccountApi } from './AccountApi';
import { AnalyticsApi } from './AnalyticsApi';
import { AuthApi } from './AuthApi';
import { EditorApi } from './EditorApi';
import { EventsApi } from './EventsApi';
import { JobsApi, MyJobsApi } from './JobsApi';
import { SystemApi } from './SystemApi';

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
export { Health, SystemApi } from './SystemApi';
export {
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
  .add(AnalyticsApi)
  .add(EventsApi)
  .add(EditorApi)
  .add(JobsApi)
  .add(MyJobsApi)
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'JSON Resume API' })) {}
