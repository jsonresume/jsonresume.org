import { Schema } from 'effect';

/** No valid session. */
export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  'Unauthorized',
  {},
  { httpApiStatus: 401 }
) {}

/** Too many attempts from this address; try again later. */
export class TooManyAttempts extends Schema.TaggedError<TooManyAttempts>()(
  'TooManyAttempts',
  { retryAfterSeconds: Schema.Number },
  { httpApiStatus: 429 }
) {}

/** The username can't be had (see docs/ACCOUNTS_AND_USERNAMES.md). */
export class UsernameUnavailable extends Schema.TaggedError<UsernameUnavailable>()(
  'UsernameUnavailable',
  { reason: Schema.Literals(['invalid', 'reserved', 'taken', 'github']) },
  { httpApiStatus: 409 }
) {}

export class EmailTaken extends Schema.TaggedError<EmailTaken>()(
  'EmailTaken',
  {},
  { httpApiStatus: 409 }
) {}

/** Wrong email or password; deliberately doesn't say which. */
export class InvalidCredentials extends Schema.TaggedError<InvalidCredentials>()(
  'InvalidCredentials',
  {},
  { httpApiStatus: 401 }
) {}

/** GitHub couldn't be asked, so a name or sign-in can't be confirmed. */
export class GithubUnreachable extends Schema.TaggedError<GithubUnreachable>()(
  'GithubUnreachable',
  {},
  { httpApiStatus: 503 }
) {}

/** Finishing a GitHub sign-up, but none was started (or it expired). */
export class NoPendingSignup extends Schema.TaggedError<NoPendingSignup>()(
  'NoPendingSignup',
  {},
  { httpApiStatus: 400 }
) {}

/** An uploaded resume that isn't a JSON object. */
export class InvalidResume extends Schema.TaggedError<InvalidResume>()(
  'InvalidResume',
  { message: Schema.String },
  { httpApiStatus: 400 }
) {}

/** An emailed link that is wrong, used, or too old. */
export class InvalidLink extends Schema.TaggedError<InvalidLink>()(
  'InvalidLink',
  {},
  { httpApiStatus: 400 }
) {}

/** Deleting an account needs its username typed back. */
export class ConfirmationMismatch extends Schema.TaggedError<ConfirmationMismatch>()(
  'ConfirmationMismatch',
  {},
  { httpApiStatus: 400 }
) {}

/** Saving to the gist needs GitHub's gist permission: sign in with GitHub again to grant it. */
export class GistPermissionNeeded extends Schema.TaggedError<GistPermissionNeeded>()(
  'GistPermissionNeeded',
  {},
  { httpApiStatus: 403 }
) {}

/** No such job on the board. */
export class JobNotFound extends Schema.TaggedError<JobNotFound>()(
  'JobNotFound',
  {},
  { httpApiStatus: 404 }
) {}

/** Matching needs a resume, and the account has none yet. */
export class NoResume extends Schema.TaggedError<NoResume>()(
  'NoResume',
  {},
  { httpApiStatus: 409 }
) {}
