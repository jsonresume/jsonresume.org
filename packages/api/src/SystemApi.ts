import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';

/** Liveness, plus which build is serving. */
export class Health extends Schema.Class<Health>('@repo/api/Health')({
  status: Schema.Literal('ok'),
  /** Git commit of the running release, or "dev". */
  version: Schema.String,
}) {}

export class SystemApi extends HttpApiGroup.make('system', {
  topLevel: true,
}).add(HttpApiEndpoint.get('health', '/health', { success: Health })) {}
