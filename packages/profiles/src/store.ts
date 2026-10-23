import { Context, Effect, Layer, Schema } from 'effect';

/**
 * A profile nobody owns yet: the mirror of GitHub user `username`'s
 * resume.json gist, kept so pages load without asking GitHub every time.
 */
export const GhostProfile = Schema.Struct({
  username: Schema.String,
  githubId: Schema.Number,
  gistId: Schema.String,
  resume: Schema.Unknown,
  fetchedAt: Schema.Date,
});
export type GhostProfile = typeof GhostProfile.Type;

/** Where profiles are kept. Postgres in production (./sql), memory in tests. */
export class ProfileStore extends Context.Service<
  ProfileStore,
  {
    findGhost(username: string): Effect.Effect<GhostProfile | undefined>;
    saveGhost(ghost: GhostProfile): Effect.Effect<void>;
    removeGhost(username: string): Effect.Effect<void>;
  }
>()('@repo/profiles/ProfileStore') {
  /** A store in memory, for tests and local development without a database. */
  static readonly memory = Layer.sync(ProfileStore, () => {
    const ghosts = new Map<string, GhostProfile>();
    return ProfileStore.of({
      findGhost: (username) => Effect.sync(() => ghosts.get(username)),
      saveGhost: (ghost) =>
        Effect.sync(() => void ghosts.set(ghost.username, ghost)),
      removeGhost: (username) =>
        Effect.sync(() => void ghosts.delete(username)),
    });
  });
}
