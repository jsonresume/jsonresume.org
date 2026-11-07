import { Accounts } from '@repo/accounts';
import { CurrentUser, JsonResumeApi, ProposalNotFound } from '@repo/api';
import { track } from '@repo/posthog';
import { Proposals, proposerOf, savedProperties } from '@repo/resume-versions';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** The signed-in person's pending proposals: list, accept, reject. */
export const ProposalsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'proposals',
  (handlers) =>
    Effect.gen(function* () {
      const proposals = yield* Proposals;
      const accounts = yield* Accounts;
      return handlers.handleAll({
        list: () =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const { resume } = yield* accounts.currentResume(user.id);
            const list = yield* proposals.pending(user.id);
            return list.map((p) => ({
              id: p.id,
              by: proposerOf(p),
              note: p.note,
              createdAt: p.createdAt.toISOString(),
              changes: proposals.changes(resume, p),
            }));
          }),
        accept: ({ params }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const [found] = yield* proposals.pending(user.id, params.id);
            if (!found) return yield* new ProposalNotFound();
            const saved = yield* accounts.saveResume(
              user.id,
              found.resume,
              proposerOf(found)
            );
            yield* proposals.decide(user.id, params.id, 'accepted');
            yield* track(user.id, 'resume_saved', {
              via: 'proposal',
              ...savedProperties(saved, 'mcp'),
            });
            return { version: saved.version };
          }),
        reject: ({ params }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const done = yield* proposals.decide(
              user.id,
              params.id,
              'rejected'
            );
            if (!done) return yield* new ProposalNotFound();
          }),
      });
    })
);
