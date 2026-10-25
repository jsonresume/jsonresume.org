import { CurrentUser, JsonResumeApi } from '@repo/api';
import { Explore } from '@repo/explore';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** Explore: everyone's public resume, searchable by anyone. */
export const ExploreHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'explore',
  (handlers) =>
    Effect.gen(function* () {
      const explore = yield* Explore;
      return handlers.handle('search', ({ query }) =>
        explore.search(query.q ?? '', Number(query.page ?? 1))
      );
    })
);

/** Whether the signed-in user's resume is listed in Explore. */
export const MyListingHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'myListing',
  (handlers) =>
    Effect.gen(function* () {
      const explore = yield* Explore;
      return handlers.handleAll({
        get: () =>
          Effect.flatMap(CurrentUser, (user) =>
            Effect.map(explore.listed(user.id), (listed) => ({ listed }))
          ),
        set: ({ payload }) =>
          Effect.flatMap(CurrentUser, (user) =>
            Effect.map(
              explore.setListed(user.id, payload.listed),
              (listed) => ({
                listed,
              })
            )
          ),
      });
    })
);
