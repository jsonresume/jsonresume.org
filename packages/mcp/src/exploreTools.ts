import { ExploreListing, ExploreResults, ResumeListing } from '@repo/api';
import { Explore } from '@repo/explore';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, hints } from './context';

export const ExploreToolkit = Toolkit.make(
  Tool.make('search_resumes', {
    description: describe('search_resumes'),
    parameters: Schema.Struct({
      query: Schema.optional(Schema.String).annotate({
        description:
          'Words that must all match: skills, a role, a place, a name or an employer, e.g. "rust berlin"',
      }),
      page: Schema.optional(Schema.Number),
    }),
    success: Schema.Struct({
      ...ExploreResults.fields,
      people: Schema.Array(
        Schema.Struct({
          ...ResumeListing.fields,
          url: Schema.String,
        })
      ),
    }),
    ...failing,
  }).annotateMerge(hints('search_resumes')),
  Tool.make('set_explore_listing', {
    description: describe('set_explore_listing'),
    parameters: ExploreListing,
    success: ExploreListing,
    ...failing,
  }).annotateMerge(hints('set_explore_listing'))
);

/** Needs Explore. */
export const ExploreHandlers = ExploreToolkit.toLayer(
  Effect.gen(function* () {
    const explore = yield* Explore;
    return {
      search_resumes: ({ query, page }) =>
        Effect.gen(function* () {
          yield* caller;
          const results = yield* explore.search(query ?? '', page ?? 1);
          return {
            ...results,
            people: results.people.map((p) => ({
              ...p,
              url: `https://jsonresume.org/@${p.username}`,
            })),
          };
        }),
      set_explore_listing: ({ listed }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          return { listed: yield* explore.setListed(user.id, listed) };
        }),
    };
  })
);
