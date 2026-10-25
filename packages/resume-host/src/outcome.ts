import type { ResumeProblem } from '@repo/domain';
import { Profiles, type Username } from '@repo/profiles';
import { Effect } from 'effect';

/** What a /@username request comes to: a response, or a problem to explain. */
export type ResumeOutcome =
  | {
      _tag: 'Respond';
      response: Response;
      /** Set when a data format was served, for the server to count the read. */
      read?: { username: string; format: 'json' | 'yaml' | 'txt' };
    }
  | { _tag: 'Problem'; problem: ResumeProblem; page: boolean };

/** Resumes change whenever their gist does; never let a cache keep one. */
export const headers = (contentType: string) => ({
  'content-type': contentType,
  'cache-control': 'no-store',
  'access-control-allow-origin': '*',
});

export const respond = (
  response: Response,
  read?: { username: string; format: 'json' | 'yaml' | 'txt' }
): ResumeOutcome =>
  read ? { _tag: 'Respond', response, read } : { _tag: 'Respond', response };
export const problem = (p: ResumeProblem, page: boolean): ResumeOutcome => ({
  _tag: 'Problem',
  problem: p,
  page,
});
export const redirect = (location: string, status: number) =>
  respond(
    new Response(null, {
      status,
      headers: { location, 'cache-control': 'no-store' },
    })
  );

/**
 * The resume at a username (another gist file with `file`): found, moved
 * to another name, or the problem, explained on a page or as JSON.
 */
export const lookup = (
  username: Username,
  file: string | undefined,
  page: boolean
) =>
  Effect.flatMap(Profiles, (profiles) =>
    profiles.resume(username, file === undefined ? {} : { file })
  ).pipe(
    Effect.catchTags({
      ProfileNotFound: (e) =>
        Effect.succeed(
          problem({ kind: e.reason, username, file: e.file }, page)
        ),
      ResumeNotJson: (e) =>
        Effect.succeed(
          problem(
            { kind: 'not-json', username, file: e.file, message: e.message },
            page
          )
        ),
      GithubUnavailable: () =>
        Effect.succeed(problem({ kind: 'github-down', username }, page)),
    })
  );
