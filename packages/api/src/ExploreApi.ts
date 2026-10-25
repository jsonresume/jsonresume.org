import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';

/** A public resume as Explore lists it: who, what they do, where, their skills. */
export const ResumeListing = Schema.Struct({
  username: Schema.String,
  name: Schema.String,
  /** basics.label: "Full Stack Developer". */
  label: Schema.NullOr(Schema.String),
  location: Schema.NullOr(Schema.String),
  /** basics.image, when it is an https URL. */
  image: Schema.NullOr(Schema.String),
  skills: Schema.Array(Schema.String),
  /** When the resume last changed here, ISO 8601. */
  updatedAt: Schema.NullOr(Schema.String),
});
export type ResumeListing = typeof ResumeListing.Type;

/** One page of Explore: people matching the words, best first. */
export const ExploreResults = Schema.Struct({
  query: Schema.String,
  page: Schema.Number,
  pageCount: Schema.Number,
  total: Schema.Number,
  people: Schema.Array(ResumeListing),
  /** The skills most resumes list, to search by. */
  popularSkills: Schema.Array(Schema.String),
});
export type ExploreResults = typeof ExploreResults.Type;

/** Whether the signed-in user's resume is listed in Explore. */
export const ExploreListing = Schema.Struct({ listed: Schema.Boolean });

/** Explore: search everyone's public resume. Open to everyone. */
export class ExploreApi extends HttpApiGroup.make('explore')
  .add(
    HttpApiEndpoint.get('search', '/', {
      query: {
        q: Schema.optional(Schema.String),
        page: Schema.optional(Schema.String),
      },
      success: ExploreResults,
    })
  )
  .prefix('/explore') {}

/** The signed-in user's place in Explore: listed (the default), or not. */
export class MyListingApi extends HttpApiGroup.make('myListing')
  .add(
    HttpApiEndpoint.get('get', '/', { success: ExploreListing }),
    HttpApiEndpoint.put('set', '/', {
      payload: ExploreListing,
      success: ExploreListing,
    })
  )
  .middleware(Authentication)
  .prefix('/me/explore') {}
