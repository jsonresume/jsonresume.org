import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { InvalidLink, TooManyAttempts } from './errors';

/** Which emails an account gets. Password resets and sign-up links always go. */
export const EmailSettings = Schema.Struct({
  /** The welcome, the confirm-your-email reminders and the empty-page nudge. */
  accountEmails: Schema.Boolean,
  /** The Monday email of new jobs (job preferences' weeklyEmail). */
  weeklyJobs: Schema.Boolean,
});
export type EmailSettings = typeof EmailSettings.Type;

/** Only the settings given change. */
export const EmailSettingsChange = Schema.Struct({
  accountEmails: Schema.optionalKey(Schema.Boolean),
  weeklyJobs: Schema.optionalKey(Schema.Boolean),
});
export type EmailSettingsChange = typeof EmailSettingsChange.Type;

export const EmailKind = Schema.Literals(['account', 'weekly', 'all']);

const link = { user: Schema.String, token: Schema.String };

/**
 * Email settings from any email's link: its token (not a session) says
 * whose, so stopping or changing takes a click or two without signing in.
 * `stop` is the List-Unsubscribe target mail apps call (RFC 8058). Public.
 */
export class EmailSettingsApi extends HttpApiGroup.make('emailSettings')
  .add(
    HttpApiEndpoint.get('get', '/', {
      query: link,
      success: EmailSettings,
      error: [InvalidLink, TooManyAttempts],
    }),
    HttpApiEndpoint.put('set', '/', {
      query: link,
      payload: EmailSettingsChange,
      success: EmailSettings,
      error: [InvalidLink, TooManyAttempts],
    }),
    HttpApiEndpoint.post('stop', '/stop', {
      query: { ...link, kind: Schema.optionalKey(EmailKind) },
      success: Schema.Struct({ stopped: Schema.Boolean }),
    })
  )
  .prefix('/email-settings') {}
