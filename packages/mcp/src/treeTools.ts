import { Accounts } from '@repo/accounts';
import { careerTree, JobMatcher, treeDigest } from '@repo/jobs';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';

const Skill = Schema.Struct({
  name: Schema.String,
  onResume: Schema.Boolean,
  /** How many of the best-fitting jobs ask for it. */
  jobs: Schema.Number,
});

export const TreeToolkit = Toolkit.make(
  Tool.make('get_career_tree', {
    description: describe('get_career_tree'),
    success: Schema.Struct({
      strengths: Schema.Array(Skill),
      gaps: Schema.Array(Skill),
      directions: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          evidence: Schema.Array(Schema.String),
          jobs: Schema.Array(
            Schema.Struct({
              id: Schema.Number,
              company: Schema.String,
              role: Schema.String,
              score: Schema.Number,
            })
          ),
        })
      ),
    }),
    ...failing,
  }).annotateMerge(hints('get_career_tree'))
);

/** Needs Accounts and JobMatcher. */
export const TreeHandlers = TreeToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const matcher = yield* JobMatcher;
    return {
      get_career_tree: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          const { resume } = yield* accounts.currentResume(user.id);
          const ranked = yield* matcher
            .rank(resume, user.id)
            .pipe(
              Effect.mapError(() =>
                failWith('Your resume is empty. Add to it first.')
              )
            );
          return treeDigest(careerTree(ranked, resume));
        }),
    };
  })
);
