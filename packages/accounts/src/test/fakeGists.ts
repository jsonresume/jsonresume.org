import { Effect, Layer } from 'effect';
import { GistAccess, GistFiles } from '../gists';

/** GitHub gists in memory: tokens map to owners; a gist has one resume.json. */
export function fakeGists() {
  const state = {
    owners: new Map<string, number>(),
    gists: new Map<string, { ownerId: number; content: string }>(),
    down: false,
  };
  let next = 1;
  const owner = (token: string) => {
    if (state.down)
      return Effect.fail(new GistAccess({ reason: 'unavailable' }));
    const id = state.owners.get(token);
    return id === undefined
      ? Effect.fail(new GistAccess({ reason: 'permission' }))
      : Effect.succeed(id);
  };
  const layer = Layer.succeed(
    GistFiles,
    GistFiles.of({
      read: (token, gistId) =>
        Effect.flatMap(owner(token), () =>
          Effect.succeed(state.gists.get(gistId)?.content)
        ),
      write: (token, gistId, content) =>
        Effect.flatMap(owner(token), (ownerId) => {
          const gist = state.gists.get(gistId);
          if (!gist || gist.ownerId !== ownerId)
            return Effect.fail(new GistAccess({ reason: 'missing' }));
          gist.content = content;
          return Effect.succeed({ gistId, ownerId });
        }),
      create: (token, content) =>
        Effect.map(owner(token), (ownerId) => {
          const gistId = `new-${next++}`;
          state.gists.set(gistId, { ownerId, content });
          return { gistId, ownerId };
        }),
    })
  );
  return { state, layer };
}
