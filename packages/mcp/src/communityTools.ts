import {
  contributors,
  creditHref,
  creditLabel,
  filterContributors,
  KIND_GROUPS,
  profileHref,
} from '@repo/contributors';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { describe, failing, hints } from './context';
import { Count, optional } from './params';

const LIMIT = 50;
const MAX = 500;

const Group = Schema.Literals(
  Object.keys(KIND_GROUPS) as ReadonlyArray<keyof typeof KIND_GROUPS>
);

export const CommunityToolkit = Toolkit.make(
  Tool.make('list_contributors', {
    description: describe('list_contributors'),
    parameters: Schema.Struct({
      query: optional(
        Schema.String,
        'Words that must all match: a name, a GitHub login, a repository or a theme'
      ),
      did: optional(
        Group,
        'Only people who did this: code (commits, pull requests, reviews), themes, projects, discussion (issues, comments) or team'
      ),
      limit: optional(
        Count,
        `How many to return (default ${LIMIT}, at most ${MAX})`
      ),
    }),
    success: Schema.Struct({
      collected: Schema.String,
      total: Schema.Number,
      people: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          github: Schema.optional(Schema.String),
          npm: Schema.optional(Schema.String),
          profile: Schema.optional(Schema.String),
          credits: Schema.Array(
            Schema.Struct({ credit: Schema.String, url: Schema.String })
          ),
        })
      ),
    }),
    ...failing,
  }).annotateMerge(hints('list_contributors'))
);

/** Needs nothing: the list is public and built in. */
export const CommunityHandlers = CommunityToolkit.toLayer({
  list_contributors: ({ query, did, limit }) =>
    Effect.sync(() => {
      const found = filterContributors(contributors.people, query ?? '', did);
      const take = Math.max(1, Math.min(MAX, Math.floor(limit ?? LIMIT)));
      return {
        collected: contributors.collected,
        total: found.length,
        people: found.slice(0, take).map((p) => {
          const profile = profileHref(p);
          return {
            name: p.name,
            ...(p.github ? { github: p.github } : {}),
            ...(p.npm ? { npm: p.npm } : {}),
            ...(profile
              ? { profile: new URL(profile, 'https://jsonresume.org').href }
              : {}),
            credits: p.credits.map((c) => ({
              credit: creditLabel(c),
              url: new URL(creditHref(c, p), 'https://jsonresume.org').href,
            })),
          };
        }),
      };
    }),
});
