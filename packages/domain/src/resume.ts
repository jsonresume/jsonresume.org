import { Schema } from 'effect';

/**
 * Why /@username could not show a resume. The server decides it; the page
 * that explains it (and the JSON error for data formats) reads it.
 */
export const ResumeProblem = Schema.Union([
  /** No GitHub user, no gist with the file, or an account not public yet. */
  Schema.Struct({
    kind: Schema.Literals(['no-user', 'no-gist', 'unpublished']),
    username: Schema.String,
    file: Schema.String,
  }),
  /** The gist file is not JSON, or not a JSON object. */
  Schema.Struct({
    kind: Schema.Literals(['not-json', 'not-object']),
    username: Schema.String,
    file: Schema.String,
    message: Schema.String,
  }),
  /** GitHub is down or rate limiting, and no copy is stored. */
  Schema.Struct({
    kind: Schema.Literal('github-down'),
    username: Schema.String,
  }),
  /** The theme asked for is not one we have, or failed on this resume. */
  Schema.Struct({
    kind: Schema.Literals(['theme-missing', 'theme-failed']),
    username: Schema.String,
    theme: Schema.String,
  }),
  /** /@name.ext with an extension we don't serve. */
  Schema.Struct({
    kind: Schema.Literal('unknown-format'),
    username: Schema.String,
    extension: Schema.String,
  }),
]);
export type ResumeProblem = typeof ResumeProblem.Type;

/** The HTTP status for each problem. */
export const resumeProblemStatus = (problem: ResumeProblem): number => {
  switch (problem.kind) {
    case 'no-user':
    case 'no-gist':
    case 'unpublished':
    case 'theme-missing':
    case 'unknown-format':
      return 404;
    case 'not-json':
    case 'not-object':
      return 400;
    case 'github-down':
      return 503;
    case 'theme-failed':
      return 500;
  }
};
