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
