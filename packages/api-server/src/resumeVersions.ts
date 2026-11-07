import { Accounts } from '@repo/accounts';
import { CurrentUser, JsonResumeApi, VersionNotFound } from '@repo/api';
import { track } from '@repo/posthog';
import {
  ResumeVersions,
  userActor,
  type ResumeVersion,
} from '@repo/resume-versions';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** How many changes a list row carries; the diff endpoint has them all. */
const SHOWN_CHANGES = 5;

const fields = (v: Omit<ResumeVersion, 'resume'>) => ({
  version: v.version,
  createdAt: v.createdAt.toISOString(),
  actor: v.actor,
  note: v.note,
});

/** The signed-in user's resume history: their own account's, only. */
export const ResumeVersionsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'resumeVersions',
  (handlers) =>
    Effect.gen(function* () {
      const versions = yield* ResumeVersions;
      const accounts = yield* Accounts;
      return handlers.handleAll({
        list: ({ query }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const page = yield* versions.list(user.id, query);
            return {
              versions: page.versions.map((v) => ({
                ...fields(v),
                changes: v.changes.slice(0, SHOWN_CHANGES),
                changeCount: v.changes.length,
              })),
              next: page.next,
            };
          }),
        get: ({ params }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const found = yield* versions.get(user.id, params.version);
            if (!found) return yield* new VersionNotFound();
            return { ...fields(found), resume: found.resume };
          }),
        diff: ({ query }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const from = query.from ?? query.to - 1;
            const changes = yield* versions.diff(user.id, from, query.to);
            if (!changes) return yield* new VersionNotFound();
            return { from, to: query.to, changes };
          }),
        restore: ({ params }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const saved = yield* accounts.restoreVersion(
              user.id,
              params.version,
              userActor
            );
            yield* track(user.id, 'version_restored', { actor: 'user' });
            return { restored: params.version, version: saved.version };
          }),
      });
    })
);
