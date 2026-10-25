import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';

export const ApiKey = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  /** The key's first characters, to tell keys apart. */
  prefix: Schema.String,
  createdAt: Schema.String,
  lastUsedAt: Schema.NullOr(Schema.String),
});
export type ApiKey = typeof ApiKey.Type;

/** The user already holds as many keys as allowed. */
export class TooManyKeys extends Schema.TaggedError<TooManyKeys>()(
  'TooManyKeys',
  { max: Schema.Number },
  { httpApiStatus: 409 }
) {}

/** The signed-in user's API keys (for /api/v1 and the jobs CLI). */
export class KeysApi extends HttpApiGroup.make('keys')
  .add(
    HttpApiEndpoint.get('list', '/', { success: Schema.Array(ApiKey) }),
    HttpApiEndpoint.post('create', '/', {
      payload: Schema.Struct({ name: Schema.String }),
      /** The key itself is in this response only. */
      success: Schema.Struct({ key: Schema.String, apiKey: ApiKey }),
      error: TooManyKeys,
    }),
    HttpApiEndpoint.delete('revoke', '/:id', {
      params: { id: Schema.String },
    })
  )
  .middleware(Authentication)
  .prefix('/account/keys') {}
