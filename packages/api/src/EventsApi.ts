import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';

const ViewId = Schema.String.pipe(
  Schema.check(
    Schema.isPattern(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    )
  )
);

/** Sent by the script in every themed resume page when it opens. */
export const ViewEvent = Schema.Struct({
  viewId: ViewId,
  username: Schema.String.pipe(Schema.check(Schema.isMaxLength(39))),
  theme: Schema.NullOr(
    Schema.String.pipe(Schema.check(Schema.isMaxLength(64)))
  ),
  referrer: Schema.NullOr(
    Schema.String.pipe(Schema.check(Schema.isMaxLength(2048)))
  ),
  width: Schema.Number,
});

/** Sent when the page is hidden or closed, and every 30s while visible. */
export const PingEvent = Schema.Struct({
  viewId: ViewId,
  seconds: Schema.Number.pipe(
    Schema.check(Schema.isBetween({ minimum: 0, maximum: 86_400 }))
  ),
  depth: Schema.Number.pipe(
    Schema.check(Schema.isBetween({ minimum: 0, maximum: 100 }))
  ),
});

/** Resume page beacons. Public, no cookies needed, always 204. */
export class EventsApi extends HttpApiGroup.make('events')
  .add(
    HttpApiEndpoint.post('view', '/view', { payload: ViewEvent }),
    HttpApiEndpoint.post('ping', '/ping', { payload: PingEvent })
  )
  .prefix('/events') {}
