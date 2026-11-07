import { Accounts } from '@repo/accounts';
import { VersionActor } from '@repo/api';
import { track } from '@repo/posthog';
import { MAX_PAGE, ResumeVersions, type Change } from '@repo/resume-versions';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import {
  caller,
  describe,
  failing,
  failWith,
  hints,
  McpActor,
} from './context';
import { Count, optional } from './params';

const SITE = 'https://jsonresume.org';
const SHOWN_CHANGES = 8;

const VersionNumber = Count.annotate({
  description: 'The version’s number, from list_versions',
});

const Listed = Schema.Struct({
  version: Schema.Number,
  createdAt: Schema.String,
  actor: VersionActor,
  note: Schema.NullOr(Schema.String),
  changes: Schema.Array(Schema.String),
  changeCount: Schema.Number,
});

/** "work[0].highlights changed" */
const line = (c: Change) => `${c.path || 'the resume'} ${c.kind}`;

export const VersionToolkit = Toolkit.make(
  Tool.make('list_versions', {
    description: describe('list_versions'),
    parameters: Schema.Struct({
      before: optional(Count, 'Only versions older than this one'),
      limit: optional(Count, `How many (1–${MAX_PAGE}, default 20)`),
    }),
    success: Schema.Struct({
      versions: Schema.Array(Listed),
      next: Schema.NullOr(Schema.Number),
    }),
    ...failing,
  }).annotateMerge(hints('list_versions')),
  Tool.make('get_version', {
    description: describe('get_version'),
    parameters: Schema.Struct({ version: VersionNumber }),
    success: Schema.Struct({
      version: Schema.Number,
      createdAt: Schema.String,
      actor: VersionActor,
      note: Schema.NullOr(Schema.String),
      resume: Schema.Unknown,
    }),
    ...failing,
  }).annotateMerge(hints('get_version')),
  Tool.make('restore_version', {
    description: describe('restore_version'),
    parameters: Schema.Struct({ version: VersionNumber }),
    success: Schema.Struct({
      restored: Schema.Number,
      version: Schema.NullOr(Schema.Number),
      url: Schema.String,
    }),
    ...failing,
  }).annotateMerge(hints('restore_version', true))
);

const noVersion = (n: number) =>
  failWith(`No version ${n}; list_versions lists them.`);

/** Needs Accounts and ResumeVersions. */
export const VersionHandlers = VersionToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const versions = yield* ResumeVersions;
    return {
      list_versions: ({ before, limit }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const page = yield* versions.list(user.id, { before, limit });
          return {
            versions: page.versions.map((v) => ({
              version: v.version,
              createdAt: v.createdAt.toISOString(),
              actor: v.actor,
              note: v.note,
              changes: v.changes.slice(0, SHOWN_CHANGES).map(line),
              changeCount: v.changes.length,
            })),
            next: page.next,
          };
        }),
      get_version: ({ version }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const found = yield* versions.get(user.id, version);
          if (!found) return yield* noVersion(version);
          return { ...found, createdAt: found.createdAt.toISOString() };
        }),
      restore_version: ({ version }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const saved = yield* accounts
            .restoreVersion(user.id, version, yield* McpActor)
            .pipe(
              Effect.mapError((e) =>
                e._tag === 'VersionNotFound'
                  ? noVersion(version)
                  : failWith(
                      e._tag === 'GistPermissionNeeded'
                        ? 'Your page reads your GitHub gist, and GitHub has not let jsonresume.org write to it. Ask the user to allow it at https://jsonresume.org/dashboard/resume.'
                        : e._tag === 'GithubUnreachable'
                        ? 'GitHub did not answer, so the gist was not updated. Try again in a minute.'
                        : 'That version could not be saved.'
                    )
              )
            );
          yield* track(user.id, 'version_restored', { actor: 'assistant' });
          return {
            restored: version,
            version: saved.version,
            url: `${SITE}/@${user.username}`,
          };
        }),
    };
  })
);
