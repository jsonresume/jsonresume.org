import { Accounts } from '@repo/accounts';
import { track } from '@repo/posthog';
import { proposerOf, Proposals, savedProperties } from '@repo/resume-versions';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';
import { saveError } from './resumeTools';

const Change = Schema.Struct({ kind: Schema.String, path: Schema.String });
const ProposalInfo = Schema.Struct({
  id: Schema.String,
  by: Schema.String,
  note: Schema.NullOr(Schema.String),
  created_at: Schema.String,
  changes: Schema.Array(Change),
});

/** Proposals: changes suggested with propose: true, for the person to decide. */
export const ProposalToolkit = Toolkit.make(
  Tool.make('list_proposals', {
    description: describe('list_proposals'),
    success: Schema.Struct({ proposals: Schema.Array(ProposalInfo) }),
    ...failing,
  }).annotateMerge(hints('list_proposals')),
  Tool.make('decide_proposal', {
    description: describe('decide_proposal'),
    parameters: Schema.Struct({
      id: Schema.String.annotate({ description: 'From list_proposals' }),
      decision: Schema.Literals(['accept', 'reject']),
    }),
    success: Schema.Struct({
      decision: Schema.String,
      version: Schema.NullOr(Schema.Number),
    }),
    ...failing,
  }).annotateMerge(hints('decide_proposal', true))
);

const missing = (id: string) =>
  failWith(`No pending proposal ${id}; list_proposals lists them.`);

/** Needs Proposals and Accounts. */
export const ProposalHandlers = ProposalToolkit.toLayer(
  Effect.gen(function* () {
    const proposals = yield* Proposals;
    const accounts = yield* Accounts;
    return {
      list_proposals: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          const { resume } = yield* accounts.currentResume(user.id);
          const list = yield* proposals.pending(user.id);
          return {
            proposals: list.map((p) => ({
              id: p.id,
              by: p.by.name ?? p.by.kind,
              note: p.note,
              created_at: p.createdAt.toISOString(),
              changes: proposals.changes(resume, p),
            })),
          };
        }),
      decide_proposal: ({ id, decision }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          if (decision === 'reject') {
            const done = yield* proposals.decide(user.id, id, 'rejected');
            if (!done) return yield* missing(id);
            return { decision, version: null };
          }
          const [found] = yield* proposals.pending(user.id, id);
          if (!found) return yield* missing(id);
          const saved = yield* accounts
            .saveResume(user.id, found.resume, proposerOf(found))
            .pipe(Effect.mapError(saveError));
          yield* proposals.decide(user.id, id, 'accepted');
          yield* track(user.id, 'resume_saved', {
            via: 'proposal',
            ...savedProperties(saved, 'mcp'),
          });
          return { decision, version: saved.version };
        }),
    };
  })
);
