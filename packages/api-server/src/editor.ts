import { Accounts, RateLimiter } from '@repo/accounts';
import { CurrentUser, JsonResumeApi } from '@repo/api';
import { CareerGraphs } from '@repo/careers';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { previewHtml } from './preview';

/** The editor's resume, and previews of unsaved changes in any theme. */
export const EditorHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'editor',
  (handlers) =>
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const careers = yield* CareerGraphs;
      const limiter = yield* RateLimiter;
      return handlers.handleAll({
        resume: () =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const current = yield* accounts.currentResume(user.id);
            // The dashboard is open: get the career graph's model work
            // under way for this version (a gist may have changed on GitHub).
            if (current.resume !== null)
              yield* careers.prepare(user.id, current.resume, 'opened');
            const gistWrite = yield* accounts.canWriteGist(user.id);
            return {
              ...current,
              github: user.github?.login ?? null,
              gistWrite,
            };
          }),
        preview: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* limiter.hit(`preview:${user.id}`, 240, 60);
            return yield* previewHtml(payload.resume, payload.theme);
          }),
      });
    })
);
