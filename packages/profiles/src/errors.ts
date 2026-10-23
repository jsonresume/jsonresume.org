import { Schema } from 'effect';

/** No resume at this username: no such GitHub user, or no gist with the file. */
export class ProfileNotFound extends Schema.TaggedError<ProfileNotFound>()(
  'ProfileNotFound',
  {
    username: Schema.String,
    reason: Schema.Literals(['no-user', 'no-gist']),
    /** The gist file looked for, e.g. resume.json. */
    file: Schema.String,
  }
) {}

/** The gist exists but its file is not JSON. */
export class ResumeNotJson extends Schema.TaggedError<ResumeNotJson>()(
  'ResumeNotJson',
  { username: Schema.String, file: Schema.String, message: Schema.String }
) {}

/** GitHub could not be reached, or refused (rate limits included). */
export class GithubUnavailable extends Schema.TaggedError<GithubUnavailable>()(
  'GithubUnavailable',
  { status: Schema.optionalKey(Schema.Number), message: Schema.String }
) {}

export type ResumeError = ProfileNotFound | ResumeNotJson | GithubUnavailable;
