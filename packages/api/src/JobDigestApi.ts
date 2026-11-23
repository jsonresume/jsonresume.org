import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';

/**
 * Turning off the weekly jobs email from the email itself: the token in its
 * link (not a session) says whose. Mail apps call it with one click (RFC
 * 8058); the stop page calls it from a button. Public.
 */
export class JobDigestApi extends HttpApiGroup.make('jobDigest')
  .add(
    HttpApiEndpoint.post('stop', '/stop', {
      query: { user: Schema.String, token: Schema.String },
      success: Schema.Struct({ stopped: Schema.Boolean }),
    })
  )
  .prefix('/job-digest') {}
