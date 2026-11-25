import { Schema } from 'effect';

/**
 * What someone did. `code`: commits; `pulls` and `issues`: ones they opened;
 * `comments`: on issues and pull requests; `reviews`: comments on a pull
 * request's code; `themes`: a theme published on npm; `projects`: a tool in
 * the projects directory; `team`: the core team or standards committee.
 */
export const CreditKind = Schema.Literals([
  'code',
  'pulls',
  'issues',
  'comments',
  'reviews',
  'themes',
  'projects',
  'team',
]);
export type CreditKind = typeof CreditKind.Type;

export const Credit = Schema.Struct({
  kind: CreditKind,
  /** A repository in the jsonresume org, an npm package, a project or a team. */
  where: Schema.String,
  count: Schema.Number,
  /** Where to see it, when it can't be worked out from `where`. */
  href: Schema.optional(Schema.String),
});
export type Credit = typeof Credit.Type;

/**
 * One person (or, for a theme, the GitHub organisation that publishes it).
 * `github` is their login; without one, `npm` is their npm username, and a
 * commit author with neither has only a name (their credit links the commit).
 */
export const Contributor = Schema.Struct({
  name: Schema.String,
  github: Schema.optional(Schema.String),
  /** GitHub's numeric id, for the avatar. */
  id: Schema.optional(Schema.Number),
  npm: Schema.optional(Schema.String),
  credits: Schema.Array(Credit),
});
export type Contributor = typeof Contributor.Type;

export const Contributors = Schema.Struct({
  /** When the list was collected (ISO date). */
  collected: Schema.String,
  /** How many public repositories of the jsonresume org were read. */
  repositories: Schema.Number,
  people: Schema.Array(Contributor),
});
export type Contributors = typeof Contributors.Type;
