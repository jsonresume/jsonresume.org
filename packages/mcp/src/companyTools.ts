import { CompanyProfile } from '@repo/api';
import { companySlug, JobBoard } from '@repo/jobs';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { describe, failing, failWith, hints } from './context';

/** Companies hiring on the board, as company-schema documents. */
export const CompanyToolkit = Toolkit.make(
  Tool.make('get_company', {
    description: describe('get_company'),
    parameters: Schema.Struct({
      name: Schema.String.annotate({
        description: 'The company, as a job names it (e.g. "Acme" or "acme")',
      }),
    }),
    success: CompanyProfile,
    ...failing,
  }).annotateMerge(hints('get_company'))
);

/** Needs JobBoard. */
export const CompanyHandlers = CompanyToolkit.toLayer(
  Effect.gen(function* () {
    const board = yield* JobBoard;
    return {
      get_company: ({ name }) =>
        board
          .company(companySlug(name))
          .pipe(
            Effect.mapError(() =>
              failWith(
                `No open jobs from ${name}. Find companies with search_jobs.`
              )
            )
          ),
    };
  })
);
