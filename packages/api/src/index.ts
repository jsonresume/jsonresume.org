import { HttpApi, OpenApi } from 'effect/http-api';
import { SystemApi } from './SystemApi';

export { Health, SystemApi } from './SystemApi';

/**
 * The jsonresume.org API. Every endpoint lives under /api. Groups are added
 * here as features move into the new app; the server implements them and
 * clients (HttpApiClient, AtomHttpApi) are derived from this definition.
 */
export class JsonResumeApi extends HttpApi.make('jsonresume')
  .add(SystemApi)
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'JSON Resume API' })) {}
